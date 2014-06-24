[![Build Status](https://secure.travis-ci.org/gfk-ba/meteor-notifications.png)](http://travis-ci.org/gfk-ba/meteor-notifications)

# Meteor notifications

notifications - Add reactive notifications to your meteor application
Makes use of meteor's rendering system, not just a jQuery/bootstrap wrapper.

See example @ [meteor.com](http://notifications-example.meteor.com/) & [github.com](https://github.com/gfk-ba/meteor-notifications-example)

## Versions
|Meteor Version|Notifications version|
| ------------- |:-------------:| -----:|
|Blaze 0.2 (Meteor 0.8.2+)|v0.5.0 and above|
|Blaze 0.1|v0.4.5 and above in v0.4.*|
|Spark|v0.4.4 and below|

## Installation

Meteor Router can be installed with [Meteorite](https://github.com/oortcloud/meteorite/). From inside a Meteorite-managed app:

``` sh
$ mrt add notifications
```
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

To change the animation speed or the change other default notification settings change the Notifications.defaultOptions object.

### Restyling the notifications
To restyle the notifications check the [styleSheet](https://github.com/gfk-ba/meteor-notifications/blob/master/notifications.less)
And create your own stylesheet in your application that overrides the classes defined in the bundled style. For instance if you want to make the success notifications red you would add the following:

``` css
li.notification {
    &.success {
        background-color: #F00;
    }
}
```

## Notifications()

Creates an instance of Notifications

## addNotification(title, message, [options={}])

Adds a notification

### Params:

* **string** *title* of the notification
* **string** *message* of the notification
* **object** *[options={}]* Options object to use for notification

## error(title, message, [options={}])

Wraps addNotification, sets type to error

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **object** *[options={}]* Options object to use for notification

## warn(title, message, [options={}])

Wraps addNotification, sets type to warning

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **object** *[options={}]* Options object to use for notification

## info(title, message, [options={}])

Wraps addNotification, sets type to info

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **object** *[options={}]* Options object to use for notification

## success(title, message, [options={}])

Wraps addNotification, sets type to success

### Params:

* **String** *title* of the notification
* **String** *message* of the notification
* **object** *[options={}]* Options object to use for notification

## getNotificationClass(notificationType)

Gets the class containing the color for the notification

### Params:

* **String** *notificationType*

## hide(mongo)

Adds the hidden property to the notifications matching the selector

### Params:

* **object** *mongo* selector to find the notification with

## remove()

Removes the notifications matching the selector

### Params:

* **selector** **

## TYPES

Stores constants for the different notification types

## defaultOptions

Object with the default options for the notifications

##Note
I already integrated the code in our application before creating the package. I partially converted the jasmine tests to tinytest but my solution
Is really horrible to write and read. So i'm just gonna wait till meteorite packages can use different frameworks and use the jasmine tests
