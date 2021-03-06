/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const Promise = require('bluebird');
const Constants = require('./Constants');
const SpireError = require('./SpireError');
const request = require('./asyncRequest');
const Operation = require('./Operation');
const debug = require('debug')('spire-fcm');

const defined = obj => typeof obj !== 'undefined';

const calculateSleepTime = (attempt, backoff) => {
  const sleepTime = Math.pow(2, attempt) * backoff;
  if (sleepTime > Constants.MAX_BACKOFF_DELAY) {
    return Constants.MAX_BACKOFF_DELAY;
  }

  return sleepTime;
};

module.exports = class {
  constructor(projectNumber, key, options = {}) {
    this.projectNumber = projectNumber;
    this.key = key;
    this.options = options;
  }

  performOperationNoRetry(operation, callback) {
    return Operation.validateOperation(operation)
    .then(() => {
      const params = {};

      if (defined(operation.operationType)) {
        params[Constants.PARAM_OPERATION] = operation.operationType;
      }
      if (defined(operation.notificationKeyName)) {
        params[Constants.PARAM_NOTIFICATION_KEY_NAME] = operation.notificationKeyName;
      }
      if (defined(operation.notificationKey)) {
        params[Constants.PARAM_NOTIFICATION_KEY] = operation.notificationKey;
      }
      if (defined(operation.tokens)) {
        params[Constants.JSON_REGISTRATION_IDS] = operation.tokens;
      }

      const body = JSON.stringify(params);

      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body, 'utf8'),
          'project_id': this.projectNumber,
          Authorization: `key=${this.key}`,
        },
        uri: Constants.FCM_NOTIFICATION_URI,
        timeout: defined(this.options.timeout) ? this.options.timeout : Constants.SOCKET_TIMEOUT,
        body,
      };

      if (defined(this.options.proxy)) {
        options.proxy = this.options.proxy;
      }

      if (defined(this.options.maxSockets)) {
        options.maxSockets = this.options.maxSockets;
      }

      return request.post(options)
      .then(([response, responseBody]) => {
        if (!response) {
          debug(`Empty response for operation (type: ${operation.operationType})... resolving.`);
          return Promise.resolve({});
        }

        const { statusCode, statusMessage } = response;

        if (statusCode !== 200) {
          let error;
          if (statusCode === 400) {
            debug('Status code: 400');
            
            try {
              error = JSON.parse(responseBody).error;
            } catch (e) {
              error = null;
            }

            if (operation.recreateKeyIfMissing && operation.operationType === 'add' &&
            (error === 'notification_key not found' || statusMessage === 'notification_key not found')) {
              debug('Operation (type: add) failed because notification_key is invalid; falling back to "create".');
              
              operation.notificationKey = null;
              operation.operationType = 'create';

              return this.performOperationNoRetry(operation);
            }
          }

          debug(`Operation failed with { code: ${statusCode}, message: ${error || statusMessage} }`);
          
          throw new SpireError({
            code: statusCode,
            message: error || statusMessage,
          });
        }

        let jsonResponse;
        try {
          jsonResponse = JSON.parse(responseBody);
        } catch (e) {
          throw e;
        }

        return jsonResponse;
      });
    })
    .asCallback(callback);
  }

  performOperation(operation, retries = 5, callback) {
    const backoff = Constants.BACKOFF_INITIAL_DELAY;

    const perform = (attempt = 0) =>
      this.performOperationNoRetry(operation)
      .catch((e) => {
        if (attempt >= retries) {
          debug(`Failed to complete operation of type: ${operation.operationType} after ${attempt + 1} attempts. No retries left.`);
          throw e;
        }

        debug(`Failed to complete operation of type: ${operation.operationType} after ${attempt + 1} attempts. Waiting to try again...`);
        
        return Promise.delay(calculateSleepTime(attempt, backoff))
        .then(() =>
          perform(attempt + 1));
      });

    debug(`Performing first operation of type: ${operation.operationType}...`);
    
    return perform();
  }
};
