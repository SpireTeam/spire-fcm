/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));

module.exports = {
  get: request.getAsync,
  post: request.postAsync,
  put: request.putAsync,
  del: request.delAsync,
  delete: request.deleteAsync,
};