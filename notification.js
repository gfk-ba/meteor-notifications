Template.notification.notificationColor = function(notificationType) {
    return Notifications.getNotificationClass(notificationType);
};

Template.notification.rendered = function () {
    var self = this,
        notificationElement = $(this.find('li'));

    if (this.data.hidden) {
        notificationElement.animate(this.data.hideAnimationProperties, {duration: this.data.animationSpeed, complete: function () {
            Notifications.remove({_id: self.data._id});
        }});
    } else {
        notificationElement.show({effect: 'fade', duration: this.data.animationSpeed});
    }
};

Template.notification.events = {
    'click': function () {
        if (this.userCloseable) {
            Notifications.hide({_id: this._id});
        }
    }
};