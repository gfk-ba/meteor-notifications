'use strict';

Template.notification.helpers({
    notificationColor: function(notificationType) {
        return Notifications.getNotificationClass(notificationType);
    }
});

Template.notification.events = {
    'click': function () {
        if (this.userCloseable || this.expires < new Date()) {
            // must the user click the close button?
            if (!this.clickBodyToClose && 0 > event.target.className.indexOf('closeButton')) {
                return;
            }

            Notifications.remove(this._id);
            if (this.closed) {
              this.closed(this);
            }
        }
    }
};
