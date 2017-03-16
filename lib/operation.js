/* spire-fcm
 * David Hunt <david@spire.me>
 * Copyright(c) 2017 Spire Labs, Inc
 * MIT Licensed
 */

const SpireError = require('./SpireError');

const VALID_OPERATION_TYPES = ['create', 'add', 'remove'];

const VALID_OP_OPTIONS = [
  'operationType',
  'notificationKeyName',
  'notificationKey',
  'recreateKeyIfMissing',
];

const defined = obj => typeof obj !== 'undefined';

module.exports = class {
  constructor(options = {}) {
    VALID_OP_OPTIONS.forEach((opt) => {
      this[opt] = defined(options[opt]) ? options[opt] : undefined;
    });

    this.tokens = options.tokens || options.registrationIds || [];
  }

  static validateOperation(operation, callback) {
    return Promise.try(() => {
      let errorMessage;

      if (!operation.operationType || !VALID_OPERATION_TYPES.includes(operation.operationType)) {
        errorMessage = 'Missing or invalid operation type';
      }

      if (!operation.notificationKeyName) {
        errorMessage = 'Missing or invalid notification key name';
      }

      if (operation.operationType !== 'create' && (!defined(operation.notificationKey))) {
        errorMessage = 'Missing or invalid notification key';
      }

      if (!operation.tokens || operation.tokens.length < 1) {
        errorMessage = 'Missing registration tokens';
      }

      if (errorMessage) throw new SpireError({ code: 400, message: errorMessage });

      return Promise.resolve();
    });
  }
};
