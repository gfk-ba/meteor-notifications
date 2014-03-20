[![Build Status](https://secure.travis-ci.org/gfk-ba/meteor-notifications.png)](http://travis-ci.org/gfk-ba/meteor-notifications)

# Meteor Notifications

Notifications - Add reactive notifications to your meteor application

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

This is a reactive variable which will trigger invalidations as the app changes pages. Usually, you'll just want to render the template that corresponds to the current page using the following helper that finds the template by name:

``` handlebars
{{renderPage}}
```

It's common to render the inside page isolated from the layout:

``` handlebars
{{#isolate}} {{renderPage}} {{/isolate}}
```

To define a route, simply specify the URL it matches and the name of the template it should render. If you want to get fancy, you can specify a reactive function that returns a template name. It will get repeatedly executed as its reactive dependencies change.

Be careful not to specify your routes inside the ```Meteor.startup``` function, or the routing won't work for the first load.
``` javascript
Meteor.Router.add({
  '/news': 'news',

  '/about': function() {
    if (Session.get('aboutUs')) {
      return 'aboutUs';
    } else {
      return 'aboutThem';
    }
  },

  '*': 'not_found'
});
```

To navigate to such a URL from in the app, either create a link which links to the URL (the router will intercept clicks and trigger relevant state changes), or call directly:

``` javascript
Meteor.Router.to('/news');
```

Note that this doesn't reload the app, it instead uses HTML5 `pushState` to change the URL whilst remaining loaded.

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