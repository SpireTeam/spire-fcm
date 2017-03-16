# spire-fcm

spire-fcm is a Node.JS module for Firebase Cloud Messaging based on yodel-gcm, a fork of node-gcm.

## Installation
```bash
$ npm install spire-fcm
```

## Usage

### Standard Push Notifications

```js
var fcm = require('spire-fcm');

// Create a message
// ... with default values
var message = new fcm.Message();

// ... or some given values
var message = new fcm.Message({
	collapseKey: 'demo',
	timeToLive: 3,
	data: {
		key1: 'message1',
		key2: 'message2'
	}
});

// Change the message data
// ... as key-value
message.addData('key1','message1');
message.addData('key2','message2');

// ... or as a data object (overwrites previous data object)
message.addData({
	key1: 'message1',
	key2: 'message2'
});

// Change the message variables
message.collapseKey = 'demo';
message.timeToLive = 3;
message.dryRun = true;

// Set up the sender with you API key
var sender = new fcm.Sender('insert Firebase Messaging Token here');

// Add the registration IDs of the devices you want to send to
var registrationIds = [];
registrationIds.push('regId1');
registrationIds.push('regId2');

// Send the message
// ... trying only once
sender.sendNoRetry(message, registrationIds, function(err, result) {
  if(err) console.error(err);
  else    console.log(result);
});

// ... or retrying
sender.send(message, registrationIds, function (err, result) {
  if(err) console.error(err);
  else    console.log(result);
});

// ... or retrying a specific number of times (10)
sender.send(message, registrationIds, 10, function (err, result) {
  if(err) console.error(err);
  else    console.log(result);
});
```

### User Notifications

User notifications were initially introduced at Google I/O 2013 and became available to all developers in late 2014. At its core, user notifications provide developers a way to associate multiple devices to a single key (often associated with an individual app user). This adds a layer of notification key management but potentially removes the burden of maintaining a local list of all registration IDs for a particular user. Using notification keys also opens up the possibility of implementing upstream messaging. Further explanation can be found within the [Official GCM User Notification docs](https://developer.android.com/google/gcm/notifications.html). If you are new to user notifications, it is highly recommended that you read this [guide for implementing User Notifications](https://medium.com/@Bicx/adventures-in-android-user-notifications-e6568871d9be) which explains some key points unmentioned in the official documentation.

#### Performing Notification Key Operations

```js
var fcm = require('spire-fcm');

// Create an operation runner for performing notification key operations
var opRunner = new gcm.OperationRunner(
  'insert Sender ID here', 
  'insert Firebase Messaging Token here'
  );

// Define a 'create' operation for creating a notification key
var createOperation = new fcm.Operation({
  operationType: 'create',
  notificationKeyName: 'appUser-Chris',
  registrationTokens: ['regId1', 'regId2']
});

// Run the 'create' operation
opRunner.performOperation(createOperation, function(err, result) {
  if (err) console.error(err);
  if (result.notification_key) {
    // Store the notification key for later use. 
    // Each successful operation returns a notification_key, and
    // it is recommended that the stored notification key be updated
    // with the returned value.
  } else {
    console.error('Did not receive notification key');
  }
});

```
#### Operation Types

**Create**: Creates a new notification key with provided registration tokens
```js
var createOperation = new fcm.Operation({
  operationType: 'create',
  notificationKeyName: 'appUser-Chris',
  registrationTokens: ['regId1', 'regId2']
});
```

**Add**: Adds new registration tokens to an existing notification key
```js
// Set recreateKeyIfMissing to true if you want to automatically retry as a
// create operation if FCM has deleted your original notification key.
var addOperation = new fcm.Operation({
  operationType: 'add',
  notificationKeyName: 'appUser-Chris',
  notificationKey: 'yourlongnotificationkeystring',
  registrationIds: ['regId2', 'regId3'],
  recreateKeyIfMissing: true
});
```

**Remove**: Removes registration tokens from an existing notification key
```js
// A notification key will be automatically deleted if all registration tokens are removed.
var addOperation = new fcm.Operation({
  operationType: 'remove',
  notificationKeyName: 'appUser-Chris',
  notificationKey: 'yournotificationkey',
  registrationIds: ['regId3']
});
```

#### Sending a Message via Notification Key
Sending a message using a notification key is nearly identical to sending a message with a registration ID array. However, rather than using `Sender`, you must use `UserNotificationSender`.
```js
// Create a message
var message = new fcm.Message({data: {...}});
// Initiate a UserNotificationSender
var userSender  = new fcm.UserNotificationSender('insert Firebase Messaging Token here');
    
userSender.send(message, 'yournotificationkey', function(err, results) {
  if (err) console.error(err);
  // Do something upon successful operation
});
```

### Debug
To enable debug mode (print requests and responses to and from FCM),
set the `DEBUG` environment flag when running your app (assuming you use `node app.js` to run your app):

```bash
DEBUG=spire-fcm node app.js
```

## Contributors
 * [monkbroc](https://github.com/monkbroc)
 * [zlyinfinite](https://github.com/zlyinfinite)
 * [Yann Biancheri](https://github.com/yannooo)
 * [Hamid Palo](https://github.com/hamidp)
 * [Dotan J.Nahum](https://github.com/jondot)
 * [Olivier Poitrey](https://github.com/rs)
 * [Max Rabin](https://github.com/maxrabin)
 * [George Miroshnykov](https://github.com/laggyluke)
 * [Alejandro Garcia](https://github.com/Alegege)
 * [Ismael Gorissen](https://github.com/igorissen)
 * [Joris Verbogt](https://github.com/silentjohnny)
 * [goelvivek](https://github.com/goelvivek)
 * [Lars Jacob](https://github.com/jaclar)
 * [Roman Iakovlev](https://github.com/RomanIakovlev) 
 * [Roman Skvazh](https://github.com/rskvazh)
 * [Jeremy Goldstein](https://github.com/jg10)
 * [Adam Patacchiola](https://github.com/surespot)
 * [Ivan Longin](https://github.com/ilongin)
 * [Paul Bininda](https://github.com/pbininda)
 * [Niels Roesen Abildgaard](https://github.com/hypesystem)
 * [Brian Bowden](https://github.com/brianbowden)
 * [David Hunt](https://github.com/davidpaulhunt)

## License 

(The MIT License)

Copyright (c) 2013 Marcus Farkas &lt;toothlessgear@finitebox.com&gt;

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