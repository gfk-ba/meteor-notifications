[![Build Status](https://secure.travis-ci.org/gfk-ba/meteor-notifications.png)](http://travis-ci.org/gfk-ba/meteor-notifications)

# Meteor Notifications

Notifications - Add reactive notifications to your meteor application

See example @ [meteor.com]http://notifications-example.meteor.com/

## Installation

Meteor Router can be installed with [Meteorite](https://github.com/oortcloud/meteorite/). From inside a Meteorite-managed app:

``` sh
$ mrt add notifications
```

## API

### Basics

To create a notification

First add the following to the template you want to be the parent for your notifications
``` handlebars
{{notifications}}
```

``` javascript
Notifications.addNotification('title', 'message');
```

### Api documentation

addNotification(title, message, options)
----------------------------------------
Adds a notification


**Parameters**

**title**:  *string*,  The title of the notification

**message**:  *string*,  The message of the notification

**options**:  *object*,  Options to use for the notification
        *type* : use one of the values from Notifications.TYPE
        *userCloseable*: enable or disable the user from closing the notifications
        *timeout*: After how many ms the notification should disappear (0 is never)


getNotificationClass(notificationType)
--------------------------------------
Gets the class containing the color for the notification


**Parameters**

**notificationType**,


**Returns**

*string*,  The classname to use for the notification

hide(The)
---------
Adds the hidden property to the notifications matching the selector


**Parameters**

**The**:  *object*,  mongo selector to use on the notification

remove(selector)
----------------
Removes the notifications matching the selector


**Parameters**

**selector**,


##Note
I already integrated the code in our application before creating the package. I partially converted the jasmine tests to tinytest but my solution
Is really horrible to write and read. So i'm just gonna wait till meteorite packages can use different frameworks and use the jasmine tests