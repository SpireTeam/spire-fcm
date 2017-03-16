/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const Promise = require('bluebird');
const request = Promise.promisify(require('request'), { multiArgs: true });

const asyncRequest = Promise.promisifyAll(request, { multiArgs: true });

module.exports = {
  get: options => asyncRequest.getAsync(options),
  post: options => asyncRequest.postAsync(options),
  put: options => asyncRequest.putAsync(options),
  del: options => asyncRequest.delAsync(options),
  delete: options => asyncRequest.deleteAsync(options),
};
