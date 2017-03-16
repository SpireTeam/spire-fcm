/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const SenderBase = require('./SenderBase');

module.exports = class extends SenderBase {
  sendNoRetry(message, notificationKey, callback) {
    const recipient = Object.prototype.toString.call(notificationKey) === '[object String]' ?
      { notificationKey } : notificationKey;
    
    return this.sendBaseNoRetry(message, recipient).asCallback(callback);
  }

  send(message, notificationKey, retries, callback) {
    const recipient = Object.prototype.toString.call(notificationKey) === '[object String]' ?
      { notificationKey } : notificationKey;
    
    return this.sendBase(message, recipient, retries, callback);
  }
};