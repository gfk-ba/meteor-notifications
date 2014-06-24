var constructor = (function() {
    /***
     * Creates an instance of Notifications
     * @constructor
     */
    function Notifications() {
        this._notificationsCollection = new Meteor.Collection(null);
        this._notificationTimeout = undefined;
    }

    /***
     * Adds a notification
     * @param {string} title of the notification
     * @param {string} message of the notification
     * @param {object} [options={}] Options object to use for notification
     */
    Notifications.prototype.addNotification = function (title, message, options) {
        options = options || {};
        _.defaults(options, this.defaultOptions);

        var notification = {};
        notification.title = title;
        notification.message = message;
        notification.type = options.type;
        notification.userCloseable = options.userCloseable;
        notification.animationSpeed = options.animationSpeed;
        notification.hideAnimationProperties = options.hideAnimationProperties;
        if (options.timeout) {
            notification.expires = new Date().getTime() + options.timeout;
        }

        this._add(notification);
    };

    /***
     * Wraps addNotification, sets type to error
     * @param {String} title of the notification
     * @param {String} message of the notification
     * @param {object} [options={}] Options object to use for notification
     * @returns {*}
     */
    Notifications.prototype.error = function (title, message, options) {
        options = options || {};
        options.type = this.TYPES.ERROR;
        return this.addNotification(title, message, options);
    };

    /***
     * Wraps addNotification, sets type to warning
     * @param {String} title of the notification
     * @param {String} message of the notification
     * @param {object} [options={}] Options object to use for notification
     * @returns {*}
     */
    Notifications.prototype.warn = function (title, message, options) {
        options = options || {};
        options.type = this.TYPES.WARNING;
        return this.addNotification(title, message, options);
    };

    /***
     * Wraps addNotification, sets type to info
     * @param {String} title of the notification
     * @param {String} message of the notification
     * @param {object} [options={}] Options object to use for notification
     * @returns {*}
     */
    Notifications.prototype.info = function (title, message, options) {
        options = options || {};
        options.type = this.TYPES.INFO;
        return this.addNotification(title, message, options);
    };

    /***
     * Wraps addNotification, sets type to success
     * @param {String} title of the notification
     * @param {String} message of the notification
     * @param {object} [options={}] Options object to use for notification
     * @returns {*}
     */
    Notifications.prototype.success = function (title, message, options) {
        options = options || {};
        options.type = this.TYPES.SUCCESS;
        return this.addNotification(title, message, options);
    };

    /***
     * Returns the NotificationsCollection Meteor.Collection
     * @returns {object} NotificationsCollection
     * @private
     */
    Notifications.prototype._getNotificationsCollection = function () {
        return this._notificationsCollection;
    };

    /***
     * Does the actual add to the collection. And creates a Timeout if necessary.
     * @param {object} notification the object to be inserted into the collection
     * @private
     */
    Notifications.prototype._add = function (notification) {
        var notificationsCollection = this._getNotificationsCollection();
        var firstExpiration = this._getFirstExpiredTimestamp();

        notificationsCollection.insert(notification);

        if (notification.expires) {
            if (this._notificationTimeout) {
                if (firstExpiration > notification.expires) {
                    Meteor.clearTimeout(this._notificationTimeout);
                    this._notificationTimeout = undefined;
                }
            }

            if (!this._notificationTimeout) {
                this._createTimeout();
            }
        }
    };

    /***
     * Returns the timestamp of the notification from the notificationsCollection that is first to expire
     * @returns {string} first to expire timestamp
     * @private
     */
    Notifications.prototype._getFirstExpiredTimestamp = function () {
        var notificationsCollection = this._getNotificationsCollection();

        var firstNotification = notificationsCollection.findOne({expires: {$gt: 0}}, {sort:[['expires', 'asc']]});
        var firstExpiredTimestamp = firstNotification ? firstNotification.expires : 0;

        return firstExpiredTimestamp;
    };

    /***
     * creates a timeout for the first to expire notification.
     * @private
     */
    Notifications.prototype._createTimeout = function () {
        var self = this;
        var firstExpiration = this._getFirstExpiredTimestamp();

        if (firstExpiration) {
            this._notificationTimeout = Meteor.setTimeout(function () {
                self.remove({expires: {$lte: firstExpiration}});
                self._createTimeout();
            }, firstExpiration - new Date().getTime());
        } else {
            this._notificationTimeout = undefined;
        }
    };

    /***
     * Gets the class containing the color for the notification
     * @param {String} notificationType
     * @returns {string} classname to use for the notification
     */
    Notifications.prototype.getNotificationClass = function (notificationType) {
        var notificationClass;

        _.each(this.TYPES,  function (value, key) {
            if(value === notificationType) {
                notificationClass = key.toLowerCase();
            }
        });

        return notificationClass;
    };

    /***
     * Removes the notifications matching the selector
     * @param selector
     */
    Notifications.prototype.remove = function (selector) {
        this._getNotificationsCollection().remove(selector);

        if (this._notificationTimeout) {
            Meteor.clearTimeout(this._notificationTimeout);
            this._notificationTimeout = undefined;
            this._createTimeout();
        }
    };

    /***
     * Stores constants for the different notification types
     * @type {{ERROR: number, WARNING: number, INFO: number, SUCCESS: number}}
     */
    Notifications.prototype.TYPES = {
        'ERROR': 1,
        'WARNING': 2,
        'INFO': 3,
        'SUCCESS': 4
    };

    /***
     * Object with the default options for the notifications
     * @type {{type: number, userCloseable: boolean, timeout: number}}
     */
    Notifications.prototype.defaultOptions = {
        type: Notifications.prototype.TYPES.INFO,
        userCloseable: true,
        timeout: 0,
        animationSpeed: 400,
        hideAnimationProperties: {
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0
        }
    };

    return Notifications;
})();

Notifications = new constructor();

Template.notifications.notifications = function() {
    return Notifications._getNotificationsCollection().find();
};

Template.notifications.rendered = function () {
    this.firstNode._uihooks = {
        insertElement: function (node, next) {
            var data = UI.getElementData(node);

            $(node)
                .addClass('hidden')
                .insertBefore(next)
                .fadeIn({duration: data.animationSpeed})
                .promise()
                .done(function () {
                    $(this).removeClass('hidden');
                });
        },
        removeElement: function (node) {
            var data = UI.getElementData(node);

            $(node).animate(data.hideAnimationProperties, {duration: data.animationSpeed, complete: function () {
                $(node).remove();
            }});
        }
    };
};