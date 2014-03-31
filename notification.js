Template.notification.notificationColor = function(notificationType) {
    return Notifications.getNotificationClass(notificationType);
};

Template.notification.rendered = function () {
    var domNode = this.find('li');

    domNode.id = this.data._id;

    $(domNode).fadeIn({duration: this.data.animationSpeed});
};

Template.notification.hide = function () {
    var self = this;
    $('#' + this._id).animate(this.hideAnimationProperties, {duration: this.animationSpeed, complete: function () {
        Notifications.remove({_id: self._id});
    }});
};

Template.notification.events = {
    'click': function () {
        if (this.userCloseable) {
            Notifications.hide({_id: this._id});
        }
    }
};