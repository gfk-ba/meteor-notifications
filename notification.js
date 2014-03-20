Template.notification.notificationColor = function(notificationType) {
    return Notifications.getNotificationClass(notificationType);
};

Template.notification.rendered = function () {
    var self = this,
        notificationElement = $(this.find('li'));

    if (this.data.hidden) {
        notificationElement.addClass('hidden', {duration: 400, complete: function () {
            Notifications.remove({_id: self.data._id});
        }});
    } else {
        notificationElement.show({effect: 'fade', duration: 400});
    }
};

Template.notification.events = {
    'click': function () {
        if (this.userCloseable) {
            Notifications.hide({_id: this._id});
        }
    }
};