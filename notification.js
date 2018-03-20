'use strict';

Template.notification.helpers({
    notificationColor: function(notificationType) {
        return Notifications.getNotificationClass(notificationType);
    }
});

Template.notification.events = {
    'click': function (event) {
        if (this.userCloseable || this.expires < new Date()) {
            // must the user click the close button?
            if (this.onBodyClick && 0 > event.target.className.indexOf('closeButton')) {
              this.onBodyClick(this);
            }
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
