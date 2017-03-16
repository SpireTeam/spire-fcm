/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

module.exports = class {
  constructor() {
    this.success = undefined;
    this.failure = undefined;
    this.canonicalIds = undefined;
    this.multicastId = undefined;
    this.results = [];
    this.retryMulticastIds = [];
  }

  addResult(result) {
    this.results.push(result);
  }

  getTotal() {
    return this.success + this.failure;
  }
}
