Package.describe({
	summary: 'Notifications - Add reactive notifications to any meteor template',
	version: '1.0.6',
	git: 'https://github.com/gfk-ba/meteor-notifications'
});

Package.on_use(function(api) {
	api.versionsFrom('METEOR@0.9.0');

	api.use([
		'templating',
		'underscore',
		'less',
		'mongo@1.0.4'
	], 'client');

	api.add_files(
			[
				'notifications.less',
				'notifications.html',
				'notifications.js',
				'notification.html',
				'notification.js'
			],
			['client']);

	api.export && api.export('Notifications', ['client']);
});

Package.on_test(function(api) {
	api.use([
		'tinytest',
		'underscore',
		'gfk:notifications'
	], 'client');

	api.use(['gfk:munit@1.0.0', 'mdj:chai@1.0.0', 'mdj:sinon@1.0.0'], 'client');

	api.add_files('notifications_tests.js', ['client']);
});
