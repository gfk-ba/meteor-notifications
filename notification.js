'use strict';

Template.notification.rendered = function () {
	//TODO: Remove this when meteor issue #2369 gets fixed
	$(this.firstNode).data('_id', this.data._id);
};

Template.notification.helpers({
    notificationColor: function(notificationType) {
        return Notifications.getNotificationClass(notificationType);
    }
});

Template.notification.events = {
    'click': function () {
        if (this.userCloseable || this.expires < new Date()) {
            Notifications.remove(this._id);
        }
    }
};