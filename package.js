Package.describe({
  summary: 'Notifications - Add reactive notifications to any meteor template'
});

Package.on_use(function (api) {
    api.use(['templating', 'underscore', 'less']);

    api.add_files('notifications.less', ['client']);
    api.add_files('notifications.html', ['client']);
    api.add_files('notification.html', ['client']);
    api.add_files('notifications.js', ['client']);
    api.add_files('notification.js', ['client']);


    api.export && api.export('Notifications', ['client']);

});

Package.on_test(function (api) {
    api.use(['notifications', 'munit', 'underscore', 'sinon', 'chai']);
    api.add_files('notifications_tests.js', ['client']);
});
