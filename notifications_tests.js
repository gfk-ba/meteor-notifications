var instance, sandbox, notificationsCollection, expect;

var setupFn = function () {
    instance = Notifications;
    sandbox = sinon.sandbox.create();
    notificationsCollection = instance._getNotificationsCollection();
};

var tearDownFn = function () {
    sandbox.restore();
    instance._notificationTimeout = undefined;
    notificationsCollection.remove({});
};

var testNotification, timedNotification, clock, testId;

var addNotification = {

    name: "addNotification",

    suiteSetup: function () {
        expect = chai.expect;
    },

    setup: function () {
        setupFn();

    },

    tearDown: function () {
        tearDownFn();
    },

    suiteTearDown: function () {

    },

    tests: [
        {
            name: 'Should call _add',
            type: 'client',
            func: function () {
                var _add = sandbox.stub(instance, '_add');
                instance.addNotification('Title', 'test123');
                expect(_add.callCount).to.equal(1);
            }
        },
        {
            name: 'Should use the defaultOptions to construct the object to pass to _add',
            type: 'client',
            func: function () {
                var _add = sandbox.stub(instance, '_add');
                var expected = _.clone(instance.defaultOptions);
                var testMessage = 'test123';
                var testTitle = 'Title';

                expected.title = testTitle;
                expected.message = testMessage;
                expected.type = instance.defaultOptions.type;
                expected.userCloseable = instance.defaultOptions.userCloseable;
                delete expected.timeout;

                instance.addNotification(testTitle, testMessage);
                expect(_add).to.have.been.calledWith(expected);
            }
        },
        {
            name: 'Called with options - it should call _add',
            type: 'client',
            func: function () {
                var testOptions = {
                    type: instance.TYPES.ERROR,
                    userCloseable: false
                };

                var _add = sandbox.stub(instance, '_add');
                instance.addNotification('Title', 'test123', testOptions);
                expect(_add.callCount).to.equal(1);
            }
        },
        {
            name: 'Called with options - Should use the options to construct the object to pass to _add',
            type: 'client',
            func: function () {
                var testOptions = {
                    type: instance.TYPES.ERROR,
                    userCloseable: false
                };

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
                expect(_add).to.have.been.calledWith(expected);
            }
        },
        {
            name: 'Called with options - Options has a timeout - Should add an expires timestamp to the notification given to _add',
            type: 'client',
            func: function () {
                sandbox.useFakeTimers();

                var timedOptions = {
                    type: instance.TYPES.ERROR,
                    userCloseable: false,
                    timeout: 2000
                };

                var _add = sandbox.stub(instance, '_add');
                instance.addNotification('Title', 'test123', _.clone(timedOptions));
                var expires = _add.args[0][0].expires;
                expect(expires).to.equal(new Date().getTime() + timedOptions.timeout);
            }
        }
    ]
};

var getNotificationClass = {

    name: "getNotificationClass",

    suiteSetup: function () {
        expect = chai.expect;
    },

    setup: function () {
        setupFn();
    },

    tearDown: function () {
        tearDownFn();
    },

    suiteTearDown: function () {

    },

    tests: [
        {
            name: 'Should return the className for the given type',
            type: 'client',
            func: function () {
                expect(instance.getNotificationClass(instance.TYPES.ERROR)).to.equal('error');
                expect(instance.getNotificationClass(instance.TYPES.WARNING)).to.equal('warning');
                expect(instance.getNotificationClass(instance.TYPES.INFO)).to.equal('info');
                expect(instance.getNotificationClass(instance.TYPES.SUCCESS)).to.equal('success');
            }
        }
    ]
};

var remove = {

    name: "remove",

    suiteSetup: function () {
        expect = chai.expect;
    },

    setup: function () {
        setupFn();
        testNotification = {};
        testNotification.message = 'test100';
        testNotification.type = instance.defaultOptions.type;
        testNotification.userCloseable = instance.defaultOptions.userCloseable;
        instance._add(testNotification);
        instance._add(testNotification);
        instance._add(testNotification);
        testNotification._id = testId = 'unique';
        instance._add(testNotification);
    },

    tearDown: function () {
        tearDownFn();
    },

    suiteTearDown: function () {

    },

    tests: [
        {
            name: 'Should remove the notification with the given _id',
            type: 'client',
            func: function () {
                var size = notificationsCollection.find().count();

                instance.remove({_id: testId});

                expect(notificationsCollection.find().count()).to.equal(size - 1);
                expect(notificationsCollection.findOne({_id: testId})).to.equal(undefined);
            }
        }
    ]
};

var _add = {

    name: "_add",

    suiteSetup: function () {
        expect = chai.expect;
    },

    setup: function () {
        setupFn();
        testNotification = {
            message: 'test100',
            type: instance.defaultOptions.type,
            userCloseable: instance.defaultOptions.userCloseable
        };

        timedNotification = _.clone(testNotification);
        timedNotification.expires = new Date().getTime() + 2000;
    },

    tearDown: function () {
        tearDownFn();
    },

    suiteTearDown: function () {

    },

    tests: [
        {
            name: 'Should call _add',
            type: 'client',
            func: function () {
                var collectionSize = notificationsCollection.find().count();
                instance._add(testNotification);
                expect(notificationsCollection.find().count()).to.equal(collectionSize + 1);
            }
        },
        {
            name: 'Should call _createTimeout',
            type: 'client',
            func: function () {
                var _createTimeout = sandbox.stub(instance, '_createTimeout');
                instance._add(timedNotification);
                expect(_createTimeout.callCount).to.equal(1);
            }
        },
        {
            name: 'When given notification has a expires timestamp - When _notifactionTimeout is truthy - Given expires is higher than any existing timestamp - Should NOT remove the existing timeout',
            type: 'client',
            func: function () {
                instance._notificationTimeout = 'test';
                notificationsCollection.insert(timedNotification);
                var slowNotification = _.clone(timedNotification);
                slowNotification.expires += 250;

                instance._add(_.clone(slowNotification));
                expect(instance._notificationTimeout).to.equal('test');
            }
        },
        {
            name: 'When given notification has a expires timestamp - When _notifactionTimeout is truthy - Given expires timestamp is lower than any existing timestamp - Should remove the existing timeout',
            type: 'client',
            func: function () {
                var fastNotification = _.clone(timedNotification);
                fastNotification.expires -= 250;

                instance._notificationTimeout = 'test';
                notificationsCollection.insert(timedNotification);

                instance._add(_.clone(fastNotification));
                expect(instance._notificationTimeout).to.not.equal('test');
            }
        },
        {
            name: 'When given notification has a expires timestamp - When _notifactionTimeout is truthy - Given expires timestamp is lower than any existing timestamp - Should call _createTimeout',
            type: 'client',
            func: function () {
                var fastNotification = _.clone(timedNotification);
                fastNotification.expires -= 250;

                instance._notificationTimeout = 'test';
                notificationsCollection.insert(timedNotification);

                var _createTimeout = sandbox.stub(instance, '_createTimeout');
                instance._add(fastNotification);
                expect(_createTimeout.callCount).to.equal(1);
            }
        }
    ]
};

var _createTimeout = {

    name: "_createTimeout",

    suiteSetup: function () {
        expect = chai.expect;
    },

    setup: function () {
        setupFn();
        clock = sandbox.useFakeTimers();

        timedNotification = {};
        timedNotification.message = 'test100';
        timedNotification.type = instance.defaultOptions.type;
        timedNotification.userCloseable = instance.defaultOptions.userCloseable;
    },

    tearDown: function () {
        tearDownFn();
    },

    suiteTearDown: function () {

    },

    tests: [
        {
            name: 'Should set _notificationTimeout',
            type: 'client',
            func: function () {
				timedNotification.expires = (new Date().getTime()) + 2000;
				notificationsCollection.insert(timedNotification);

                instance._createTimeout();
                expect(instance._notificationTimeout).to.not.equal(undefined);
            }
        }
		//TODO: Uncomment tests when meteor issue #2369 gets fixed
//        {
//            name: 'Should remove the notification when the timeout expires',
//            type: 'client',
//            func: function () {
//				timedNotification.expires = (new Date().getTime()) + 2000;
//				notificationsCollection.insert(timedNotification);
//
//                var collectionSize = notificationsCollection.find().count();
//                instance._createTimeout();
//                clock.tick(1999);
//                expect(notificationsCollection.find().count()).to.equal(collectionSize);
//                clock.tick(2000);
//
//                expect(notificationsCollection.find().count()).to.equal(collectionSize - 1);
//            }
//        },
//		{
//			name: 'Called with very short timeout - Should remove the notification when the timeout expires',
//			type: 'client',
//			func: function () {
//				timedNotification.expires = (new Date().getTime()) + 10;
//				notificationsCollection.insert(timedNotification);
//
//				var collectionSize = notificationsCollection.find().count();
//				instance._createTimeout();
//				clock.tick(9);
//				expect(notificationsCollection.find().count()).to.equal(collectionSize);
//				clock.tick(10);
//
//				expect(notificationsCollection.find().count()).to.equal(collectionSize - 1);
//			}
//		}
    ]
};

Munit.run(addNotification);
Munit.run(getNotificationClass);
Munit.run(remove);
Munit.run(_createTimeout);
Munit.run(_add);