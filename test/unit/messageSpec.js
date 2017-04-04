const Message = require('../../lib/Message');
const chai = require('chai');

const expect = chai.expect;

describe('UNIT Message', () => {
  describe('constructor', () => {
    it('should create an empty message with a data object if not passed an object', () => {
      const mess = new Message();
      expect(mess.collapseKey).to.be.undefined;
      expect(mess.timeToLive).to.be.undefined;
      expect(mess.dryRun).to.be.undefined;
      expect(mess.priority).to.be.undefined;
      expect(mess.contentAvailable).to.be.undefined;
      expect(mess.restrictedPackageName).to.be.undefined;
      expect(mess.data).to.be.undefined;
      expect(mess.notification).to.be.undefined;
    });

    it('should create a message with properties passed in', () => {
      const obj = {
        collapseKey: 'Message',
        timeToLive: 100,
        dryRun: true,
        priority: 'normal',
        contentAvailable: true,
        restrictedPackageName: 'com.test.app',
        data: {
          score: 98,
        },
        notification: {
          title: 'testTitle',
          body: 'testBody',
        },
      };
      var mess = new Message(obj);
      expect(JSON.stringify(mess)).to.equal(JSON.stringify(obj));
    });

    it('should only set properties passed into constructor', () => {
      const obj = {
        collapseKey: 'Message',
        data: {
          score: 98,
        },
      };
      const mess = new Message(obj);
      expect(JSON.stringify(mess)).to.equal(JSON.stringify(obj));
      expect(mess.timeToLive).to.be.undefined;
      expect(mess.priority).to.be.undefined;
      expect(mess.contentAvailable).to.be.undefined;
      expect(mess.restrictedPackageName).to.be.undefined;
      expect(mess.dryRun).to.be.undefined;
      expect(mess.notification).to.be.undefined;
    });
  });

  describe('addData()', () => {
    it('should add properties to the message data object given a key and value', () => {
      const mess = new Message();
      mess.addData('myKey', 'Message');
      expect(mess.data.myKey).to.equal('Message');
    });

    it('should only set values on data object, not top level message', () => {
      const mess = new Message();
      mess.addData('collapseKey', 'Message');
      expect(mess.collapseKey).to.not.equal('Message');
      expect(mess.data.collapseKey).to.equal('Message');
    });

    it('should set the data property to the object passed in', () => {
      const mess = new Message();
      const obj = {
        message: 'hello',
        key: 'value',
      };
      mess.addData(obj);
      expect(mess.data).to.deep.equal(obj);
    });

    it.skip('should overwrite data object when an object is passed in', () => {
      var data = {
        message: 'hello',
        key: 'value'
      };
      var mess = new Message({ data: { message: 'bye', prop: 'none' } });
      mess.addData(data);
      expect(mess.data).to.deep.equal(data);
    });

    it('should not overwrite data if not passed an object', () => {
      const data = {
        message: 'hello',
        key: 'value',
      };
      const mess = new Message({ data });
      mess.addData('adding');
      expect(mess.data).to.deep.equal(data);
    });

    it('should not overwrite data if passed an empty object', () => {
      const data = {
        message: 'hello',
        key: 'value',
      };
      const mess = new Message({ data });
      mess.addData({});
      expect(mess.data).to.deep.equal(data);
    });

    it.skip('should do something if not called properly');
  });

  describe('addData() with key/value', () => {
    it('should add properties to the message data object given a key and value', () => {
      const mess = new Message();
      mess.addData('myKey', 'Message');
      expect(mess.data.myKey).to.equal('Message');
    });

    it('should only set values on data object, not top level message', () => {
      const mess = new Message();
      mess.addData('collapseKey', 'Message');
      expect(mess.collapseKey).to.not.equal('Message');
      expect(mess.data.collapseKey).to.equal('Message');
    });

    it.skip('should do something if not called properly');
  });
});