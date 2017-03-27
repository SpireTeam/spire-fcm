# spire-fcm

spire-fcm is an asynchronous Node.JS module for Firebase Cloud Messaging based on [yodel-gcm](https://github.com/SpireTeam/spire-fcm), a fork of [node-gcm](https://github.com/ToothlessGear/node-gcm).

## Installation
```bash
$ npm install spire-fcm
# or
$ yarn add spire-fcm
```

## Usage

### Push Notification

```js
const fcm = require('spire-fcm');

const sender = new fcm.UserNotificationSender(process.env.FCM_SERVER_KEY);

// A data message
const message = new fcm.Message({
  data: {
    key1: 'This is a key value',
    key2: 'This is also a key value',
  },
  // can include message options
  restrictedPackageName: 'com.example.android',
  collapseKey: 'demo',
});

// A notification message
const message = new fcm.Message({
  notification: {
    body: 'This is a push notification',
    title: 'Demo Push Notification',
  },
  // can include message options
  restrictedPackageName: 'com.example.android',
  collapseKey: 'demo',
});


// send to one or more fcm registration ids
sender.send(message, {
  tokens: ['fcm-registration-example-1', 'fcm-registration-example-2'],
})
.then(handleResponse);

// send to a device group
sender.send(message, {
  notificationKey: 'fcm-device-group-key',
  notificationKeyName: 'example-fcm-device-key-name',
})
.then(handleResponse);

/*
 * An example response
 */
{ "multicast_id": 108,
  "success": 1,
  "failure": 0,
  "canonical_ids": 0,
  "results": [
    { "message_id": "1:08" }
  ]
}
```

For more information on FCM message types, see [here](https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages), or the response itself, see [here](https://firebase.google.com/docs/cloud-messaging/send-message).

### Device Groups

Device groups allow you notify 2+ related FCM registration tokens at one time.

```js
/*
 * Create a new operation runner. It should be used throughout.
 */
const runner = new fcm.OperationRunner(
  process.env.FCM_SENDER_ID,
  process.env.FCM_SERVER_KEY);


/*
 * Create a new operation for each request - "create", "add", "remove"
 */

// Create a new device group
const operation = new fcm.Operation({
  operationType: 'create',
  tokens: ['fcm-registration-example-1'],
  notificationKeyName: 'example-fcm-device-key-name', // unique identifier across your device groups
});

// Add additional tokens to an existing device group
const operation = new fcm.Operation({
  operationType: 'add',
  tokens: ['fcm-registration-example-2'],
  notificationKey: 'fcm-device-group-key', // obtained through "create" operation
  notificationKeyName: 'example-fcm-device-key-name',
});

// Remove a token from an existing device group
const operation = new fcm.Operation({
  operationType: 'remove',
  tokens: ['fcm-registration-example-1'],
  notificationKey: 'fcm-device-group-key',
  notificationKeyName: 'example-fcm-device-key-name',
});

// Perform the newly created operation
runner.performOperation(operation).then(handleResponse);
```

You can find more information on device group management [here](https://firebase.google.com/docs/cloud-messaging/ios/device-group).

## API

_The bare bones_

### fcm.UserNotificationSender

```js
new fcm.UserNotificationSender(FCM_SERVER_KEY)
  FCM_SERVER_KEY: String required


const sender = new fcm.UserNotificationSender(FCM_SERVER_KEY)


sender.send(message, recipient, retries)
  message: fcm.Message required
  recipient: Object default={}
    // either tokens or notificationKey is required
    tokens: Array
    notificationKey: String
  retries: Number default=5


sender.sendNoRetry(message, recipient)
  message: fcm.Message required
  recipient: Object default={}
    // either tokens or notificationKey is required
    tokens: Array
    notificationKey: String
```

### fcm.Message

```js
new fcm.Message(options)
  options: Object
    // either notification or data is required
    notification: Object
    data: Object
    collapseKey: String
    timeToLive: Number
    dryRun: Boolean
    priority: String
    contentAvailable: Boolean
    restrictedPackageName: String
```

### fcm.OperationRunner

```js
new fcm.OperationRunner(FCM_SENDER_ID, FCM_SERVER_KEY)
  FCM_SENDER_ID: String required
  FCM_SERVER_KEY: String required
```

### fcm.Operation

```js
new fcm.Operation(options)
  options: Object required
    operationType: String required ["create", "add", "remove"]
    tokens: Array required
    // notificationKey is required except for "create"
    notificationKey: String
    notificationKeyName: String required
```

### fcm.SpireError
```js
// A custom, catchable error, for example:
sender.send(message, recipient)
.then(handleResponse)
.catch(fcm.SpireError, handleFCMErrors)
.catch(handleOtherErrors);
```

## Contributors
 * [Brian Bowden](https://github.com/brianbowden)
 * [David Hunt](https://github.com/davidpaulhunt)

## License 

(The MIT License)

Copyright (c) 2017 Spire Labs, Inc

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.