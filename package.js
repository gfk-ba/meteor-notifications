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
		'mongo'
	], 'client');

	api.addFiles(
			[
			  'lib/globals.js',
				'notifications.html',
				'notifications.js',
				'notification.html',
				'notification.js'
			],
			'client');

	api.export('Notifications', ['client']);
});

Package.onTest(function(api) {
	api.use([
		'gfk:notifications',
		'spacejamio:munit@2.1.0'
	], 'client');

	api.addFiles('notifications_tests.js', 'client');
});
