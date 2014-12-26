/*jshint -W098*/
/*global describe, it, before, beforeEach, after, afterEach, sinon, beforeAll, chai */
var instance, sandbox, notificationsCollection;

var setupFn = function () {
    if (sandbox) {
        //Munit doesn't call the afterEach when a test fails so we do cleanup here to prevent cascading fails
        //See for more info: https://github.com/spacejamio/meteor-munit/issues/24
        tearDownFn();
    }

    instance = Notifications;
    sandbox = sinon.sandbox.create();
    notificationsCollection = instance._getNotificationsCollection();
};

var tearDownFn = function () {
    sandbox.restore();
    instance._notificationTimeout = undefined;
    notificationsCollection.remove({});
    sandbox = undefined;
};

var testNotification, timedNotification, clock, testId;

var expect = chai.expect;

describe('#addNotification', function () {
    beforeEach(function () {
        setupFn();
    });

    it('Should call _add', function () {
        var _add = sandbox.stub(instance, '_add');
        instance.addNotification('Title', 'test123');
        expect(_add.callCount).to.equal(1);
    });

    it('Should use the defaultOptions to construct the object to pass to _add', function () {
        var _add = sandbox.stub(instance, '_add');
        var expected = _.clone(instance.defaultOptions);
        var testMessage = 'test123';
        var testTitle = 'Title';

        expected.title = testTitle;
        expected.message = testMessage;
        expected.type = instance.defaultOptions.type;
        expected.userCloseable = instance.defaultOptions.userCloseable;
        expected.clickBodyToClose = instance.defaultOptions.clickBodyToClose;
        expected.closed = undefined;

        delete expected.timeout;

        instance.addNotification(testTitle, testMessage);
        expect(_add).to.have.been.calledWith(expected);
    });

    it('Should use defaultOptionsByType if exists for type', function () {
        var _add = sandbox.stub(instance, '_add');
        var expected = _.clone(instance.defaultOptions);
        var testMessage = 'test123';
        var testTitle = 'Title';

        Notifications.defaultOptionsByType[Notifications.TYPES.WARNING] = {};
        Notifications.defaultOptionsByType[Notifications.TYPES.WARNING].userCloseable = false;
        Notifications.defaultOptionsByType[Notifications.TYPES.WARNING].clickBodyToClose = false;
        Notifications.defaultOptionsByType[Notifications.TYPES.WARNING].closed = 'blabla';

        delete expected.timeout;
        expected.title = testTitle;
        expected.message = testMessage;
        expected.type = Notifications.TYPES.WARNING;
        expected.userCloseable = false;
        expected.clickBodyToClose = false;
        expected.closed = 'blabla';


        instance.warn(testTitle, testMessage);
        expect(_add).to.have.been.calledWith(expected);
    });

    it('Called with options - it should call _add', function () {
        var testOptions = {
            type: instance.TYPES.ERROR,
            userCloseable: false
        };

        var _add = sandbox.stub(instance, '_add');
        instance.addNotification('Title', 'test123', testOptions);
        expect(_add.callCount).to.equal(1);
    });

    it('Called with options - Should use the options to construct the object to pass to _add', function () {
        var testOptions = {
            type: instance.TYPES.ERROR,
            userCloseable: false,
            clickBodyToClose: true,
            closed: 'test123'
        };

        var _add = sandbox.stub(instance, '_add');
        var expected = _.clone(instance.defaultOptions);
        var testMessage = 'test123';
        var testTitle = 'Title';

        expected.title = testTitle;
        expected.message = testMessage;
        expected.type = testOptions.type;
        expected.userCloseable = testOptions.userCloseable;
        expected.clickBodyToClose = testOptions.clickBodyToClose;
        expected.closed = 'test123';
        delete expected.timeout;
        instance.addNotification(testTitle, testMessage, _.clone(testOptions));
        expect(_add).to.have.been.calledWith(expected);
    });

    it('Called with options - Options has a timeout - Should add an expires timestamp to the notification given to _add', function () {
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
    });
});

describe('#getNotificationClass', function () {
    beforeEach(function () {
        setupFn();
    });


    it('Should return the className for the given type', function () {
        expect(instance.getNotificationClass(instance.TYPES.ERROR)).to.equal('error');
        expect(instance.getNotificationClass(instance.TYPES.WARNING)).to.equal('warning');
        expect(instance.getNotificationClass(instance.TYPES.INFO)).to.equal('info');
        expect(instance.getNotificationClass(instance.TYPES.SUCCESS)).to.equal('success');
    });
});

describe('#remove', function () {
    var testNotification;

    beforeEach(function () {
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
    });

    it('Should remove the notification with the given _id', function () {
        var size = notificationsCollection.find().count();

        instance.remove({_id: testId});

        expect(notificationsCollection.find().count()).to.equal(size - 1);
        expect(notificationsCollection.findOne({_id: testId})).to.equal(undefined);
    });
});

describe('#_add', function () {
    var testNotification, timedNotification;

    beforeEach(function () {
        setupFn();
        testNotification = {
            message: 'test100',
            type: instance.defaultOptions.type,
            userCloseable: instance.defaultOptions.userCloseable
        };

        timedNotification = _.clone(testNotification);
        timedNotification.expires = new Date().getTime() + 2000;
    });

    it('Should call _add', function () {
        var collectionSize = notificationsCollection.find().count();
        instance._add(testNotification);
        expect(notificationsCollection.find().count()).to.equal(collectionSize + 1);
    });

    it('Should call _createTimeout', function () {
        var _createTimeout = sandbox.stub(instance, '_createTimeout');
        instance._add(timedNotification);
        expect(_createTimeout.callCount).to.equal(1);
    });

    it('When given notification has a expires timestamp - When _notifactionTimeout is truthy - Given expires is higher than any existing timestamp - Should NOT remove the existing timeout', function () {
        instance._notificationTimeout = 'test';
        notificationsCollection.insert(timedNotification);
        var slowNotification = _.clone(timedNotification);
        slowNotification.expires += 250;

        instance._add(_.clone(slowNotification));
        expect(instance._notificationTimeout).to.equal('test');
    });

    it('When given notification has a expires timestamp - When _notifactionTimeout is truthy - Given expires timestamp is lower than any existing timestamp - Should call _createTimeout', function () {
        var fastNotification = _.clone(timedNotification);
        fastNotification.expires -= 250;

        instance._notificationTimeout = 'test';
        notificationsCollection.insert(timedNotification);

        var _createTimeout = sandbox.stub(instance, '_createTimeout');
        instance._add(fastNotification);
        expect(_createTimeout.callCount).to.equal(1);
    });
});

describe('#_createTimeout', function () {
    var timedNotification, clock;

    beforeEach(function () {
        setupFn();
        clock = sandbox.useFakeTimers();

        timedNotification = {};
        timedNotification.message = 'test100';
        timedNotification.type = instance.defaultOptions.type;
        timedNotification.userCloseable = instance.defaultOptions.userCloseable;
    });

    it('Should set _notificationTimeout', function () {
        timedNotification.expires = (new Date().getTime()) + 2000;
        notificationsCollection.insert(timedNotification);

        instance._createTimeout();
        expect(instance._notificationTimeout).to.not.equal(undefined);
    });

    it('Should remove the notification when the timeout expires', function () {
        timedNotification.expires = (new Date().getTime()) + 2000;
        notificationsCollection.insert(timedNotification);

        var collectionSize = notificationsCollection.find().count();
        instance._createTimeout();
        clock.tick(1999);
        expect(notificationsCollection.find().count()).to.equal(collectionSize);
        clock.tick(2000);

        expect(notificationsCollection.find().count()).to.equal(collectionSize - 1);
    });

    it('Called with very short timeout - Should remove the notification when the timeout expires', function () {
        timedNotification.expires = (new Date().getTime()) + 10;
        notificationsCollection.insert(timedNotification);

        var collectionSize = notificationsCollection.find().count();
        instance._createTimeout();
        clock.tick(9);
        expect(notificationsCollection.find().count()).to.equal(collectionSize);
        clock.tick(10);

        expect(notificationsCollection.find().count()).to.equal(collectionSize - 1);
    });
});

describe('#getDefaultOptions', function () {
    beforeEach(function () {
        setupFn();
    });

    it('Should return defaultOptions when type is not given', function () {
        expect(instance.getDefaultOptions()).to.eql(Notifications.defaultOptions);
    });

    it('Should return defaultOptions of the type when type is given', function () {
        Notifications.defaultOptionsByType[Notifications.TYPES.WARNING] = {
            foo: 'bar'
        };
        
        expect(instance.getDefaultOptions(Notifications.TYPES.WARNING)).to.eql(Notifications.defaultOptionsByType[Notifications.TYPES.WARNING]);
    });

});
