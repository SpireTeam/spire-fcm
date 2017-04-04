/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const VALID_MESSAGE_OPTIONS = [
  'collapseKey',
  'timeToLive',
  'dryRun',
  'priority',
  'contentAvailable',
  'restrictedPackageName',
  'data',
  'notification',
];

module.exports = class {
  constructor(options = {}) {
    VALID_MESSAGE_OPTIONS.forEach((opt) => {
      this[opt] = typeof options[opt] !== 'undefined' ? options[opt] : undefined;
    });
  }

  addData(key, value) {
    if (Object.prototype.toString.call(key) === '[object Object]') {
      if (typeof this.data === 'undefined') {
        this.data = key;
      } else {
        Object.keys(key).forEach((prop) => {
          this.data[prop] = key[prop];
        });
      }
    } else if (Object.prototype.toString.call(key) === '[object String]') {
      if (Object.prototype.toString.call(this.data) !== '[object Object]') {
        this.data = { [key]: value };
      } else {
        this.data[key] = value;
      }
    } else {
      throw new Error(`Invalid argument(s) for addData: must be an object or key/value pair`);
    }
  }
};
