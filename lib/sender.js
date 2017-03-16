/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */
const SenderBase = require('./SenderBase');

module.exports = class extends SenderBase {
  sendNoRetry(message, tokens, callback) {
    return this.sendBaseNoRetry(message, { tokens }).asCallback(callback);
  }

  send(message, tokens, retries, callback) {
    return this.sendBase(message, { tokens }, retries).asCallback(callback);
  }
};