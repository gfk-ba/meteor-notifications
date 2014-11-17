'use strict';

Template.notification.helpers({
    notificationColor: function(notificationType) {
        return Notifications.getNotificationClass(notificationType);
    }
});

Template.notification.events = {
    'click': function () {
        if (this.userCloseable || this.expires < new Date()) {
            Notifications.remove(this._id);
            if (this.closed) {
              this.closed(this);
            }
        }
    }
};
