/*
	TODO: Put munit tests back in here when somebody ports munit to meteor 0.9.0 (https://github.com/spacejamio/meteor-munit/issues/13)
 */
var wrapTest = function (beforeArray, afterArray, testActual) {
	_.each(beforeArray, function (fn) {
		if(_.isFunction(fn)) {
			fn();
		}
	});

	return function (test) {
		testActual(test);
		_.each(afterArray, function (fn) {
			if(_.isFunction(fn)) {
				fn();
			}
		});
	}
};

var beforeArray = [], afterArray = [];
var instance, sandbox, notificationsCollection;

beforeArray.push(function () {
	instance = Notifications;
	sandbox = sinon.sandbox.create();
	notificationsCollection = instance._getNotificationsCollection();
});

afterArray.push(function () {
	sandbox.restore();
	instance._notificationTimeout = undefined;
	notificationsCollection.remove({});
});

//addNotification
(function (b, a) {
	var beforeArray = _.clone(b), afterArray = _.clone(a);

	Tinytest.add('#addNotification - Should call _add', wrapTest(beforeArray, afterArray, function (test) {
		var _add = sandbox.stub(instance, '_add');
		instance.addNotification('Title', 'test123');
		test.equal(_add.callCount, 1, 'Expect _add to be called');
	}));

	Tinytest.add('#addNotification - Should use the defaultOptions to construct the object to pass to _add', wrapTest(beforeArray, afterArray, function (test) {
		var _add = sandbox.stub(instance, '_add');
		var expected = _.clone(instance.defaultOptions);
		var testMessage = 'test123';
		var testTitle = 'Title';

		expected.title = testTitle;
		expected.message = testMessage;
		delete expected.timeout;
		instance.addNotification(testTitle, testMessage);

		test.equal(_add.args[0][0], expected, '_add not called with expected values');
	}));

	(function (b, a) {
		var beforeArray = _.clone(b);
		var afterArray = _.clone(a);
		var testOptions;

		beforeArray.push(function () {
			testOptions = {
				type: instance.TYPES.ERROR,
				userCloseable: false
			};
		});

		Tinytest.add('#addNotification - Called with options - Should call _add', wrapTest(beforeArray, afterArray, function (test) {
			var _add = sandbox.stub(instance, '_add');
			instance.addNotification('Title', 'test123', testOptions);
			test.equal(_add.callCount, 1, 'Expect _add to be called');
		}));

		Tinytest.add('#addNotification - Called with options - Should use the defaultOptions to construct the object to pass to _add', wrapTest(beforeArray, afterArray, function (test) {
			var _add = sandbox.stub(instance, '_add');
			var expected = _.clone(instance.defaultOptions);
			var testMessage = 'test123';
			var testTitle = 'Title';

			expected.title = testTitle;
			expected.message = testMessage;
			expected.type = testOptions.type;
			expected.userCloseable = testOptions.userCloseable;
			delete expected.timeout;
			instance.addNotification(testTitle, testMessage, _.clone(testOptions));
			test.equal(_add.args[0][0], expected, '_add not called with expected values');
		}));

		(function (b, a) {
			var beforeArray = _.clone(b);
			var afterArray = _.clone(a);
			var timedOptions;

			beforeArray.push(function () {
				timedOptions = _.clone(testOptions);
				timedOptions.timeout = 2000;
			});

			Tinytest.add('#addNotification - Called with options - Options has a timeout - Should add an expires timestamp to the notification given to _add', wrapTest(beforeArray, afterArray, function (test) {
				var _add = sandbox.stub(instance, '_add');

				var expected = new Date().getTime() + timedOptions.timeout;

				instance.addNotification('Title', 'test123', _.clone(timedOptions));
				var expires = _add.args[0][0].expires;

				test.equal(_add.args[0][0].expires, expected, '_add not called with timestamp');
			}));
		}(beforeArray, afterArray));
	}(beforeArray, afterArray));
}(beforeArray, afterArray));

//_add
(function (b, a) {
	var beforeArray = _.clone(b), afterArray = _.clone(a), testNotification;
	var message = '#_add - ';

	beforeArray.push(function () {
		testNotification = {};
		testNotification.message = 'test100';
		testNotification.type = instance.defaultOptions.type;
		testNotification.userCloseable = instance.defaultOptions.userCloseable;
	});

	Tinytest.add(message + 'Should add an item to the notificationsCollection', wrapTest(beforeArray, afterArray, function (test) {
		var collectionSize = notificationsCollection.find().count();
		instance._add(testNotification);
		test.equal(notificationsCollection.find().count(), collectionSize + 1, 'Should add an extra notification to the notifications array');

	}));

	(function (b, a) {
		var beforeArray = _.clone(b);
		var afterArray = _.clone(a);
		var timedNotification;
		message += 'When given notification has a expires timestamp - ';

		beforeArray.push(function () {
			timedNotification = _.clone(testNotification);
			timedNotification.expires = 2000;
		});

		Tinytest.add(message + 'Should call _createTimeout', wrapTest(beforeArray, afterArray, function (test) {
			var _createTimeout = sandbox.stub(instance, '_createTimeout');
			instance._add(timedNotification);
			test.equal(_createTimeout.calledOnce, true, '_createTimeout should have been called');
		}));

		(function (b, a) { //When _notifactionTimeout is truthy
			var beforeArray = _.clone(b);
			var afterArray = _.clone(a);
			var timedOptions;
			message += 'When _notifactionTimeout is truthy';

			beforeArray.push(function () {
				instance._notificationTimeout = 'test';
				notificationsCollection.insert(timedNotification);
			});

			(function (b, a) {
				var beforeArray = _.clone(b);
				var afterArray = _.clone(a);
				var slowNotification;

				message += 'Given expires is higher than any existing timestamp';

				beforeArray.push(function () {
					slowNotification = _.clone(timedNotification);
					slowNotification.expires += 5050;

				});

				Tinytest.add(message + 'Should NOT remove the existing timeout', wrapTest(beforeArray, afterArray, function (test) {
					instance._notificationTimeout = 'test';
					instance._add(_.clone(slowNotification));
					test.equal(instance._notificationTimeout, 'test', 'Has removed existing timeout');
				}));
			}(beforeArray, afterArray));

			(function (b, a) {
				var beforeArray = _.clone(b);
				var afterArray = _.clone(a);
				var fastNotification;

				message += 'Given expires timestamp is lower than any existing timestamp';

				beforeArray.push(function () {
					fastNotification = _.clone(timedNotification);
					fastNotification.expires -= 1500;
				});

				Tinytest.add(message + 'Should call _createTimeout', wrapTest(beforeArray, afterArray, function (test) {
					var _createTimeout = sandbox.stub(instance, '_createTimeout');
					instance._add(fastNotification);
					test.equal(_createTimeout.calledOnce, true, 'Should have called _createTimeout');
				}));
			}(beforeArray, afterArray));
		}(beforeArray, afterArray));
	}(beforeArray, afterArray));
}(beforeArray, afterArray));