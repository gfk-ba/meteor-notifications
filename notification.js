'use strict';

Template.notification.notificationColor = function(notificationType) {
    return Notifications.getNotificationClass(notificationType);
};

Template.notification.rendered = function () {
    var domNode = this.find('li'),
        self = this;

    $(domNode).fadeIn({duration: this.data.animationSpeed})
        .promise()
        .done(function () {
            $(this).removeClass('hidden');
        });

    if(!this.firstNode.parentNode._uihooks) {
        this.firstNode.parentNode._uihooks = {
            removeElement: function (node) {
                $(node).animate(self.data.hideAnimationProperties, {duration: self.data.animationSpeed, complete: function () {
                    $(node).remove();
                }});
            }
        };
    }
};

Template.notification.events = {
    'click': function () {
        if (this.userCloseable) {
            Notifications.remove(this._id);
        }
    }
};