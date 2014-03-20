Package.describe({
  summary: 'Notifications - Add reactive notifications to any meteor template'
});

Package.on_use(function (api, where) {
    api.use(['templating', 'underscore', 'less', 'jquery-ui']);

    api.add_files('notifications.less', ['client']);
    api.add_files('notifications.html', ['client']);
    api.add_files('notification.html', ['client']);
    api.add_files('notifications.js', ['client']);
    api.add_files('notification.js', ['client']);


    api.export && api.export('Notifications', ['client']);

});

Package.on_test(function (api) {
    api.use(['notifications', 'tinytest', 'underscore']);

    api.add_files('sinon-1.9.0.js', ['client']);
    api.add_files('notifications_tests.js', ['client']);
});
