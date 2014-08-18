var VERSION = '1.0.0';

Package.describe({
	summary: 'Notifications - Add reactive notifications to any meteor template',
	version: VERSION,
	git: 'https://github.com/gfk-ba/meteor-notifications'
});

Package.onUse(function(api) {
	api.versionsFrom('0.9.0-rc9');
	api.use([
		'templating@1.0.0',
		'underscore@1.0.0',
		'less@1.0.0'
	], 'client');

	api.addFiles('notifications.less', ['client']);
	api.addFiles('notifications.html', ['client']);
	api.addFiles('notification.html', ['client']);
	api.addFiles('notifications.js', ['client']);
	api.addFiles('notification.js', ['client']);

	api.export && api.export('Notifications', ['client']);
});

Package.onTest(function(api) {
	api.use([
		'tinytest@1.0.0',
		'underscore@1.0.0',
		'juanlavaina:chai@0.1.5',
		'juanlavaina:sinon@0.1.5',
		'gfk:notifications@' + VERSION
	], 'client');

	api.addFiles('notifications_tests.js', ['client']);
});
