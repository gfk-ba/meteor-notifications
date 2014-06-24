'use strict';

Template.notification.notificationColor = function(notificationType) {
    return Notifications.getNotificationClass(notificationType);
};

Template.notification.events = {
    'click': function () {
        if (this.userCloseable) {
            Notifications.remove(this._id);
        }
    }
};