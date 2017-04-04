/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

module.exports = class extends Error {
  constructor({ message = 'Internal Server Error', code = 500 } = {}) {
    super(message);
    this.code = code;
  }
};