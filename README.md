Unit tests: [![Build Status](https://secure.travis-ci.org/gfk-ba/meteor-notifications.png)](http://travis-ci.org/gfk-ba/meteor-notifications)

[UI tests](http://notifications-example.meteor.com/): [![Build Status](https://secure.travis-ci.org/gfk-ba/meteor-notifications-example.png)](http://travis-ci.org/gfk-ba/meteor-notifications-example)


# Meteor notifications

Add tooltip-style reactive notifications to your Meteor application. Makes use of Meteor's rendering system; not just a jQuery/bootstrap wrapper.

See example page @ [meteor.com](http://notifications-example.meteor.com/) source: [github.com](https://github.com/gfk-ba/meteor-notifications-example)

## Versions
|Meteor Version|Notifications version|
| ------------- |:-------------:| -----:|
|Meteor 0.8.2+ (Blaze 0.2)|v0.5.0 and above|
|Meteor 0.8.0+ (Blaze 0.1)|v0.4.5 and above in v0.4.*|
|Meteor 0.7.0+ (Spark)|v0.4.4 and below|

*Note: v1.0.0 & v1.0.1 was only published to troposphere(Meteor's own package server). v1.0.2 Are published on both troposphere & atmosphere*

*Note: untested on versions before 0.7.0*

## Installation

*Meteor 0.9.0 and above:*

``` sh
$ meteor add gfk:notifications
```

*Meteor 0.8 and below - use [Meteorite](https://github.com/oortcloud/meteorite/):*

``` sh
$ mrt add notifications
```

## Contributing 

All contributions are welcome! Please submit pull requests. Do not forget to add tests and make sure everything is green or travis will get ya!

## Testing

### Unit tests
To run the unit tests execute the following command from within your checkout:

```bash
meteor test-packages ./

```

### UI tests
To make my life and yours easier I've also created some basic UI tests for this project. They are stored in the [meteor-notifications-example](https://github.com/gfk-ba/meteor-notifications-example) repository. 

After each new version the example page is updated to use the latest version, after which travis runs the UI tests.
But you can ofcourse also run them locally.

1. Clone the [example page repo](https://github.com/gfk-ba/meteor-notifications-example)
2. From within your checkout run the following commands: 
```bash
mkdir -p app/packages
ln -s #YourNotificationsPackageCheckoutDirectory# app/packages/gfk:notifications
```
3. Make sure you have the example page running on port ```3000```
4. From within the example page repo checkout run: ```nightwatch -c firefoxDev

The example page is also a good place to debug/check your new functionality. Consider adding a example of the new functionality and creating a PR for that too!

## API

### Basics

To create a notification

First add the following to the template you want to be the parent for your notifications.
``` handlebars
{{> notifications}}
```


Then run the following code in your application to spawn a notification of the type of the method you use to spawn it:
``` javascript
Notifications.warn('title', 'message');
Notifications.error('title', 'message');
Notifications.info('title', 'message');
Notifications.success('title', 'message');
```

### Changing default settings

To change the animation speed or the [`hideAnimationProperties`](https://github.com/dandv/meteor-notifications/blob/master/notifications.js#L241), you need to change the `Notifications.settings` object.

**Example:**

``` javascript
Meteor.startup(function () {
    Notifications.settings.animationSpeed = 500;
});
```



Default options to be used for each notification can be changed in the `Notifications.defaultOptions` object.

**Example:**

``` javascript
Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 5000
    });
});
```

Optionally, you can also provide type-specific options by changing the `Notifications.defaultOptionsByType` object.

``` javascript
Meteor.startup(function () {
    //Give Error notifications a longer timeout
    Notifications.defaultOptionsByType[Notifications.TYPES.ERROR] = _.defaults({
        timeout: 10000
    },
    Notifications.defaultOptions);
});
```


### Restyling the notifications

To restyle the notifications check the [styleSheet](https://github.com/gfk-ba/meteor-notifications/blob/master/notifications.less)
and create your own stylesheet that overrides the classes defined in the bundled style. For instance, if you want to make the success notifications red you would add the following:

``` css
li.notification {
    &.success {
        background-color: #F00;
    }
}
```

## Notifications()

Creates an instance of `Notifications`.

## addNotification(title, message, [options={}])

Adds a notification.

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **Object** *[options={}]* Options object to use for notification
* **String** *[options.type=defaultOptions.type]* the type of the notification
* **Boolean** *[options.userCloseable=defaultOptions.userCloseable]* Whether the notification is user closeable
* **Boolean** *[options.clickBodyToClose=defaultOptions.clickBodyToClose]* Whether the notification can be closed by clicking anywhere in the body. If turned off then the user must click the close button.
* **Number** *[options.timeout=defaultOptions.timeout]* No. of milliseconds after which this notification should automatically be closed. Use 0 to disable this.
* **Function** *[options.closed]* Call this handler (passing data context) on notification close

### Returns:

* **String** id of the added notification.

## error(title, message, [options={}])

Wraps `addNotification`, sets type to error.

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **Object** *[options={}]* Options object to use for notification
* **Boolean** *[options.userCloseable=defaultOptions.userCloseable]* Whether the notification is user closeable
* **Boolean** *[options.clickBodyToClose=defaultOptions.clickBodyToClose]* Whether the notification can be closed by clicking anywhere in the body. If turned off then the user must click the close button.
* **Number** *[options.timeout=defaultOptions.timeout]* No. of milliseconds after which this notification should automatically be closed. Use 0 to disable this.
* **Function** *[options.closed]* Call this handler (passing data context) on notification close

### Returns:

* **String** id of the added notification.

## warn(title, message, [options={}])

Wraps `addNotification`, sets type to warning

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **Object** *[options={}]* Options object to use for notification
* **Boolean** *[options.userCloseable=defaultOptions.userCloseable]* Whether the notification is user closeable
* **Boolean** *[options.clickBodyToClose=defaultOptions.clickBodyToClose]* Whether the notification can be closed by clicking anywhere in the body. If turned off then the user must click the close button.
* **Number** *[options.timeout=defaultOptions.timeout]* No. of milliseconds after which this notification should automatically be closed. Use 0 to disable this.
* **Function** *[options.closed]* Call this handler (passing data context) on notification close

### Returns:

* **String** id of the added notification.

## info(title, message, [options={}])

Wraps `addNotification`, sets type to info

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **Object** *[options={}]* Options object to use for notification
* **Boolean** *[options.userCloseable=defaultOptions.userCloseable]* Whether the notification is user closeable
* **Boolean** *[options.clickBodyToClose=defaultOptions.clickBodyToClose]* Whether the notification can be closed by clicking anywhere in the body. If turned off then the user must click the close button.
* **Number** *[options.timeout=defaultOptions.timeout]* No. of milliseconds after which this notification should automatically be closed. Use 0 to disable this.
* **Function** *[options.closed]* Call this handler (passing data context) on notification close

### Returns:

* **String** id of the added notification.

## success(title, message, [options={}])

Wraps `addNotification`, sets type to success

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **Object** *[options={}]* Options object to use for notification
* **Boolean** *[options.userCloseable=defaultOptions.userCloseable]* Whether the notification is user closeable
* **Boolean** *[options.clickBodyToClose=defaultOptions.clickBodyToClose]* Whether the notification can be closed by clicking anywhere in the body. If turned off then the user must click the close button.
* **Number** *[options.timeout=defaultOptions.timeout]* No. of milliseconds after which this notification should automatically be closed. Use 0 to disable this.
* **Function** *[options.closed]* Call this handler (passing data context) on notification close

### Returns:

* **String** id of the added notification.

## getNotificationClass(notificationType)

Gets the class containing the color for the notification

### Params:

* **String** *notificationType*

## remove(selector)

Removes the notifications matching the mongo query selector

### Params:

* **selector** Mongo query selector

**Example:**

``` javascript
// Create Notification
var notificationId = Notifications.success('title', 'message');
// Remove exisiting notification sometime between [0,5) seconds
Meteor.setTimeout( function () {
    Notifications.remove({ _id: notificationId });
}, Math.Random() * 5000 );
```

## TYPES

Stores constants for the different notification types

## defaultOptions

Object with the default options for the notifications

## defaultOptionsByType
Object with the default options for the notifications for specific types

