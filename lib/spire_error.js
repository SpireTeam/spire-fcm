module.exports = class extends Error {
  constructor({ message = 'Internal Server Error', code = 500 } = {}) {
    super(message);
    this.code = code;
  }
};