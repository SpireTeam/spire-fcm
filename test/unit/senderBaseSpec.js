const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const SenderBase = require('../../lib/SenderBase');
const Constants = require('../../lib/Constants');

const expect = chai.expect;

describe('UNIT SenderBase', () => {
  describe('constructor', () => {
    it('should create a new instance of SenderBase with key and options set from arguments', () => {
      const key = 'abc123';
      const opts = { foo: 'bar' };
      const sender = new SenderBase(key, opts);

      expect(sender).to.be.instanceOf(SenderBase);
      expect(sender.key).to.equal(key);
      expect(sender.options).to.deep.equal(opts);
    });
  });
});
