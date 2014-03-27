[![Build Status](https://secure.travis-ci.org/gfk-ba/meteor-notifications.png)](http://travis-ci.org/gfk-ba/meteor-notifications)

# Meteor notifications

notifications - Add reactive notifications to your meteor application

See example @ [meteor.com](http://notifications-example.meteor.com/)

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

### Api documentation

Notifications()
---------------
The singleton instance of Notifications


addNotification(title, message, \[options={}\])
-----------------------------------------------
Adds a notification


**Parameters**

**title**:  *string*,  The title of the notification

**message**:  *string*,  The message of the notification

**[options={}]**:  *object*,  Options object to use for notification
        *type* : use one of the values from Notifications.TYPE
        *userCloseable*: enable or disable the user from closing the notifications
        *timeout*: After how many ms the notification should disappear (0 is never)
        *animationSpeed*: Duration of the animation in ms


error(title, message, \[options={}\])
-------------------------------------
Wraps addNotification, sets type to error


**Parameters**

**title**,  The title of the notification

**message**,  The message of the notification

**[options={}]**:  *object*,  Options object to use for notification

warn(title, message, \[options={}\])
------------------------------------
Wraps addNotification, sets type to warning


**Parameters**

**title**,  The title of the notification

**message**,  The message of the notification

**[options={}]**:  *object*,  Options object to use for notification

info(title, message, \[options={}\])
------------------------------------
Wraps addNotification, sets type to info


**Parameters**

**title**,  The title of the notification

**message**,  The message of the notification

**[options={}]**:  *object*,  Options object to use for notification

success(title, message, \[options={}\])
---------------------------------------
Wraps addNotification, sets type to success


**Parameters**

**title**,  The title of the notification

**message**,  The message of the notification

**[options={}]**:  *object*,  Options object to use for notification

getNotificationClass(notificationType)
--------------------------------------
Gets the class containing the color for the notification


**Parameters**

**notificationType**,


**Returns**

*string*,  The classname to use for the notification

hide(selector)
---------
Adds the hidden property to the notifications matching the selector


**Parameters**

**selector**:  *object*,  mongo selector to find the notification with

remove(selector)
----------------
Removes the notifications matching the selector


**Parameters**

**selector**,

##Note
I already integrated the code in our application before creating the package. I partially converted the jasmine tests to tinytest but my solution
Is really horrible to write and read. So i'm just gonna wait till meteorite packages can use different frameworks and use the jasmine tests