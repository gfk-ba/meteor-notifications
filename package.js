function configurePackage (api) {
	if (api.versionsFrom) {
		api.versionsFrom('METEOR@0.9.0-rc13');
	}

	api.use([
		'templating@1.0.0',
		'underscore@1.0.0',
		'less@1.0.0'
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
}

Package.describe({
	summary: 'Notifications - Add reactive notifications to any meteor template',
	version: 'v1.0.4',
	git: 'https://github.com/gfk-ba/meteor-notifications'
});

Package.on_use(function(api) {
	configurePackage(api);

	api.export && api.export('Notifications', ['client']);
});

Package.on_test(function(api) {
	configurePackage(api);

	api.use([
		'tinytest@1.0.0',
		'underscore@1.0.0',
		'juanlavaina:chai@0.1.5',
		'juanlavaina:sinon@0.1.5'
	], 'client');

	api.add_files('notifications_tests.js', ['client']);
});
