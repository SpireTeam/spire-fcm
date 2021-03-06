/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const Promise = require('bluebird');
const request = require('./asyncRequest');
const Constants = require('./Constants');
const SpireError = require('./SpireError');
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
  constructor(key, options = {}) {
    this.key = key;
    this.options = options;
  }

  sendBaseNoRetry(message, recipient = {}, callback) {
    const params = {};

    const tokens = recipient.tokens || recipient.registrationTokens || recipient.registrationIds;
    const notificationKey = recipient.notificationKey;
    if (defined(tokens)) {
      params[Constants.JSON_REGISTRATION_IDS] = tokens;
    } else if (defined(notificationKey)) {
      params[Constants.PARAM_TO] = notificationKey;
    } else {
      debug('No recipients provided: must include tokens, registrationTokens, or registrationIds');
      
      throw new SpireError({
        code: 400,
        message: 'No recipients provided',
      });
    }

    if (defined(message.collapseKey)) {
      params[Constants.PARAM_COLLAPSE_KEY] = message.collapseKey;
    }
    if (defined(message.timeToLive)) {
      params[Constants.PARAM_TIME_TO_LIVE] = message.timeToLive;
    }
    if (defined(message.dryRun)) {
      params[Constants.PARAM_DRY_RUN] = message.dryRun;
    }
    if (defined(message.priority)) {
      params[Constants.PARAM_PRIORITY] = message.priority;
    }
    if (defined(message.contentAvailable)) {
      params[Constants.PARAM_CONTENT_AVAILABLE] = message.contentAvailable;
    }
    if (defined(message.restrictedPackageName)) {
      params[Constants.PARAM_RESTRICTED_PACKAGE_NAME] = message.restrictedPackageName;
    }
    if (defined(message.data) && Object.keys(message.data).length > 0) {
      params[Constants.PARAM_DATA_PAYLOAD_KEY] = message.data;
    }
    if (defined(message.notification) && Object.keys(message.notification).length > 0) {
      params[Constants.PARAM_NOTIFICATION_PAYLOAD_KEY] = message.notification;
    }

    const body = JSON.stringify(params);

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body, 'utf8'),
        Authorization: `key=${this.key}`,
      },
      uri: Constants.FCM_SEND_URI,
      timeout: this.options.timeout || Constants.SOCKET_TIMEOUT,
      body,
    };

    if (this.options.proxy) {
      options.proxy = this.options.proxy;
    }

    if (this.options.maxSockets) {
      options.maxSockets = this.options.maxSockets;
    }

    return request.post(options)
    .then(([response, responseBody]) => {
      if (!response || !response.body) {
        debug('Empty response or response.body, resolving.');
        
        return Promise.resolve({});
      }

      const { statusCode, statusMessage } = response;

      if (statusCode !== 200) {
        debug(`Send request failed with { code: ${statusCode}, message: ${statusMessage} }`);
        
        throw new SpireError({
          code: statusCode,
          message: statusMessage,
        });
      }

      let jsonResponse;
      try {
        jsonResponse = JSON.parse(response.body);
      } catch (e) {
        throw e;
      }

      return jsonResponse;
    })
    .asCallback(callback);
  }

  sendBase(message, recipient = {}, retries = 5) {
    const backoff = Constants.BACKOFF_INITIAL_DELAY;
    const tokens = recipient.tokens || recipient.registrationTokens || recipient.registrationIds;
    const notificationKey = recipient.notificationKey;
    if (!defined(tokens) && !defined(notificationKey)) {
      debug('No recipients provided: must include notificationKey, tokens, registrationTokens, or registrationIds');
      
      throw new SpireError({
        code: 400,
        message: 'No recipients provided',
      });
    }

    const send = (batchTokens = tokens, attempt = 0) => {
      const batchRecipient = recipient;
      if (batchTokens) {
        batchRecipient.tokens = batchTokens;
      }
      return this.sendBaseNoRetry(message, batchRecipient)
      .then((response) => {
        if (attempt >= retries) {
          debug(`Done after trying to send to all recipient ${attempt} times.`);
          
          return response;
        }

        if (tokens && tokens.length > 0) {
          const unsentTokens = tokens.filter((token, i) => {
            const result = response.results[i].error;
            return result === 'Unavailable';
          });

          if (unsentTokens && unsentTokens.length > 0) {
            debug(`Unsent tokens remaining, waiting to resend to ${unsentTokens.length} tokens.`);
            
            return Promise.delay(calculateSleepTime(attempt, backoff))
            .then(() =>
              send(unsentTokens, attempt + 1));
          }
        } else if (notificationKey) {
          if (response && defined(response.success) && defined(response.failure) && defined(response.failed_registration_ids)) {
            debug(`Sent via notification_key ${notificationKey}, waiting to resent to ${response.failed_registration_ids.length} failed tokens.`);
            return Promise.delay(calculateSleepTime(attempt, backoff))
            .then(() =>
              send(result.failed_registration_ids, attempt + 1));
          }
        }

        return response;
      })
      .catch((e) => {
        if (attempt >= retries) {
          debug(`Failed to finish sending message(s) after ${attempt} attempts; throwing error - ${e}`);
          throw e;
        }

        debug(`Failed to send on attempt ${attempt + 1}, waiting to retry...`);
        
        return Promise.delay(calculateSleepTime(attempt, backoff))
        .then(() =>
          send(batchTokens, attempt + 1));
      });
    };

    return send();
  }
};
