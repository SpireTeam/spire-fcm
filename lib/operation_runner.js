var Constants = require('./constants');
var SpireError = require('./spire_error');
var req = require('request');
var debug = require('debug')('spire-fcm');
var Operation = require('./operation');

function OperationRunner(projectNumber, key, options) {
    if (!(this instanceof OperationRunner)) {
        return new OperationRunner(projectNumber, key, options);
    }

    this.projectNumber = projectNumber;
    this.key = key;
    this.options = options;
}

OperationRunner.prototype.performOperationNoRetry = function(op, callback) {

    if(!callback) {
        callback = function() {};
    }

    if (!Operation.isValidOperation(op, callback)) return;

    var body = {},
        requestBody,
        post_options,
        post_req,
        timeout;

    if (op.operationType !== undefined) {
        body[Constants.PARAM_OPERATION] = op.operationType;
    }
    if (op.notificationKeyName !== undefined) {
        body[Constants.PARAM_NOTIFICATION_KEY_NAME] = op.notificationKeyName;
    }
    if (op.notificationKey !== undefined) {
        body[Constants.PARAM_NOTIFICATION_KEY] = op.notificationKey;
    }
    if (op.registrationIds !== undefined) {
        body[Constants.JSON_REGISTRATION_IDS] = op.registrationIds;
    }

    requestBody = JSON.stringify(body);

    post_options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-length': Buffer.byteLength(requestBody, 'utf8'),
            'project_id': this.projectNumber,
            'Authorization': 'key=' + this.key
        },
        uri: Constants.FCM_NOTIFICATION_URI,
        body: requestBody
    };

    if (this.options && this.options.proxy) {
        post_options.proxy = this.options.proxy;
    }

    if (this.options && this.options.maxSockets) {
        post_options.maxSockets = this.options.maxSockets;
    }

    timeout = Constants.SOCKET_TIMEOUT;

    if (this.options && this.options.timeout) {
        timeout =  this.options.timeout;
    }

    post_options.timeout = timeout;

    var self = this;
    post_req = req(post_options, function (err, res, resBody) {

        if (err) {
            return callback(err, null);

        }
        if (!res) {
            return callback('response is null', null);

        }
        if (res.statusCode !== 200) {
          debug('Error completing FCM request: ' + res.statusMessage + '(' + res.statusCode + ')');
          var error;
          if (res.statusCode === 400) {
            try { error = JSON.parse(resBody).error; } catch(err) { error = null; }
            if (op.recreateKeyIfMissing && op.operationType === 'add' &&
              (error === 'notification_key not found' || res.statusMessage === 'notification_key not found')) {
                // The notification key no longer exists (which happens when you remove all reg IDs). 
                // Try a 'create' operation.
                debug('Switching from an add to a create operation');
                op.notificationKey = null;
                op.operationType = 'create';
                return self.performOperationNoRetry(op, callback);
            }
          }
          error = new SpireError({
            code: res.statusCode,
            message: error || res.statusMessage,
          });
          return callback(error, resBody);
        }

        try {
            callback(null, JSON.parse(resBody));
        } catch (e) {
            debug("Error handling GCM response " + e);
            callback("Error handling GCM response: " + e, null);
        }
    });
};

OperationRunner.prototype.performOperation = function(op, retries, callback) {
    if(typeof retries === 'undefined' || typeof retries === 'function') {
        callback = retries;
        retries = 5;
    }

    if(!callback) {
        callback = function() {};
    }

    var attempt = 0,
        backoff = Constants.BACKOFF_INITIAL_DELAY,
        self = this;

    this.performOperationNoRetry(op, function lambda(err, result) {
        if (attempt < retries) {
            var sleepTime, i;

            if (err >= 500) {

                debug('Unsuccessful notification key operation request. Retrying: ' + attempt)

                sleepTime = Math.pow (2, attempt) * backoff;
                if (sleepTime > Constants.MAX_BACKOFF_DELAY) {
                    sleepTime = Constants.MAX_BACKOFF_DELAY;
                }

                setTimeout(function () {
                    self.performOperationNoRetry(op, lambda);
                }, sleepTime);

                attempt += 1;

            } else {
                // retries complete
                callback(err, result);
            }

        } else {
            // attempts has exceeded retries
            callback(err, result);
        }
    });
};

module.exports = OperationRunner;

