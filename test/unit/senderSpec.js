const chai = require('chai');
const expect = chai.expect;

const Sender = require('../../lib/Sender');
const Promise = require('bluebird');

describe('UNIT Sender', () => {
  // Use object to set arguments passed into callback
  const args = {};

  describe('constructor', () => {
    it('should create a Sender with key and options passed in', () => {
      const options = {
        proxy: 'http://myproxy.com',
        maxSockets: 100,
        timeout: 100
      };
      const key = 'myAPIKey';
      const sender = new Sender(key, options);
      expect(sender).to.be.instanceOf(Sender);
      expect(sender.key).to.equal(key);
      expect(sender.options).to.deep.equal(options);
    });

    it.skip('should do something if not passed a valid key');
  });

  describe('sendNoRetry()', () => {
    const restore = {};

    before(() => {
      restore.sendBaseNoRetry = Sender.prototype.sendBaseNoRetry;
      Sender.prototype.sendBaseNoRetry = (message, recipient) =>
        Promise.resolve({
          message, recipient,
        });
    });

    after(() => {
      Sender.prototype.sendBaseNoRetry = restore.sendBaseNoRetry;
    });

    it('should pass a message, recipient with tokens, and callback to sendBaseNoRetry', () => {
      const recipient = { tokens: [1, 2, 3] };
      const message = 'hello';
      const sender = new Sender('myKey');

      sender.sendNoRetry(message, recipient)
      .then(({ message: rMessage, recipient: rRecipient }) => {
        expect(rMessage).to.equal.message;
        expect(rRecipient).to.equal.recipient;
      });
    });
    
  });

  describe('send()', () => {
    const restore = {};

    before(() => {
      restore.sendBase = Sender.prototype.sendBase;
      Sender.prototype.sendBase = (message, recipient, retryCount) =>
        Promise.resolve({
          message, recipient, retryCount,
        });
    });

    after(() => {
      Sender.prototype.sendBase = restore.sendBase;
    });

    it('should pass a message, recipient with tokens, retry count, and callback to sendBase', () => {
      const recipient = { tokens: [1, 2, 3] };
      const message = 'hello';
      const sender = new Sender('myKey');

      sender.sendBase(message, [1, 2, 3], 1)
      .then(({
        message: rMessage, recipient: rRecipient, retryCount,
      }) => {
        expect(rMessage).to.equal.message;
        expect(rRecipient).to.equal.recipient;
        expect(retryCount).to.equal(1);
      });
    });
  });

});



