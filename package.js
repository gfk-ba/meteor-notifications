Package.describe({
	summary: 'Notifications - Add reactive notifications to any meteor template',
	version: '1.1.0',
	git: 'https://github.com/gfk-ba/meteor-notifications'
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.0');

	api.use([
		'templating',
		'underscore',
		'less',
		'mongo@1.0.4'
	], 'client');

	api.addFiles(
			[
			  'lib/globals.js',
				'notifications.less',
				'notifications.html',
				'notifications.js',
				'notification.html',
				'notification.js',
			],
			['client']);

	api.export && api.export('Notifications', ['client']);
});

Package.onTest(function(api) {
	api.use([
		'tinytest',
		'underscore',
		'gfk:notifications@1.1.0'
	], 'client');

	api.use(['spacejamio:munit@2.1.0'], 'client');

	api.addFiles('notifications_tests.js', ['client']);
});
