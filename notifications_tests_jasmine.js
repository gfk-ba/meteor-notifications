describe('Notifications', function () {
    var instance, sandbox, notificationsCollection;

    beforeEach(function () {
        instance = Global.Notifications;
        sandbox = sinon.sandbox.create();
        notificationsCollection = instance._getNotificationsCollection();
    });

    afterEach(function () {
        sandbox.restore();
        instance._notificationTimeout = undefined;
        notificationsCollection.remove({});
    });

    describe('#addNotification', function () {

        it('Should call _add', function () {
            var _add = sandbox.stub(instance, '_add');
            instance.addNotification('Title', 'test123');
            expect(_add).toHaveBeenCalled();
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
            delete expected.timeout;

            instance.addNotification(testTitle, testMessage);
            expect(_add).toHaveBeenCalledWith(expected);
        });

        describe('Called with options', function () {
            var testOptions;

            beforeEach(function () {
                testOptions = {
                    type: instance.TYPES.ERROR,
                    userCloseable: false
                };
            });

            it('Should call _add', function () {
                var _add = sandbox.stub(instance, '_add');
                instance.addNotification('Title', 'test123', testOptions);
                expect(_add).toHaveBeenCalled();
            });

            it('Should use the options to construct the object to pass to _add', function () {
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
                expect(_add).toHaveBeenCalledWith(expected);
            });

            describe('Options has a timeout', function () {
                var clock,
                    timedOptions;

                beforeEach(function () {
                    clock = sandbox.useFakeTimers();

                    timedOptions = _.clone(testOptions);
                    timedOptions.timeout = 2000;
                });

                it('Should add an expires timestamp to the notification given to _add', function () {
                    var _add = sandbox.stub(instance, '_add');
                    instance.addNotification('Title', 'test123', _.clone(timedOptions));
                    var expires = _add.args[0][0].expires;
                    expect(expires).toEqual(new Date().getTime() + timedOptions.timeout);
                });
            });
        });
    });

    describe('#_add', function () {
        var testNotification;

        beforeEach(function () {
            testNotification = {};
            testNotification.message = 'test100';
            testNotification.type = instance.defaultOptions.type;
            testNotification.userCloseable = instance.defaultOptions.userCloseable;
        });

        it('Should add an item to the notificationsCollection', function () {
            var collectionSize = notificationsCollection.find().count();
            instance._add(testNotification);
            expect(notificationsCollection.find().count()).toEqual(collectionSize + 1);
        });

        describe('When given notification has a expires timestamp', function () {
            var timedNotification;

            beforeEach(function () {
                timedNotification = _.clone(testNotification);
                timedNotification.expires = new Date().getTime() + 2000;
            });

            it('Should call _createTimeout', function () {
                var _createTimeout = sandbox.stub(instance, '_createTimeout');
                instance._add(timedNotification);
                expect(_createTimeout).toHaveBeenCalled();
            });

            describe('When _notifactionTimeout is truthy', function () {
                beforeEach(function () {
                    instance._notificationTimeout = 'test';
                    notificationsCollection.insert(timedNotification);
                });

                describe('Given expires is higher than any existing timestamp', function () {
                    var slowNotification;

                    beforeEach(function () {
                        slowNotification = _.clone(timedNotification);
                        slowNotification.expires += 250;
                    });

                    it('Should NOT remove the existing timeout', function () {
                        instance._add(_.clone(slowNotification));
                        expect(instance._notificationTimeout).toEqual('test');
                    });
                });

                describe('Given expires timestamp is lower than any existing timestamp', function () {
                    var fastNotification;

                    beforeEach(function () {
                        fastNotification = _.clone(timedNotification);
                        fastNotification.expires -= 250;
                    });

                    it('Should remove the existing timeout', function () {
                        instance._add(_.clone(fastNotification));
                        expect(instance._notificationTimeout).toNotEqual('test');
                    });

                    it('Should call _createTimeout', function () {
                        var _createTimeout = sandbox.stub(instance, '_createTimeout');
                        instance._add(fastNotification);
                        expect(_createTimeout).toHaveBeenCalled();
                    });
                });
            });
        });
    });

    describe('#_createTimeout', function () {
        var timedNotification, clock;

        beforeEach(function () {
            clock = sandbox.useFakeTimers();

            timedNotification = {};
            timedNotification.message = 'test100';
            timedNotification.type = instance.defaultOptions.type;
            timedNotification.userCloseable = instance.defaultOptions.userCloseable;
            timedNotification.expires = (new Date().getTime()) + 2000;

            notificationsCollection.insert(timedNotification);
        });

        it('Should set _notificationTimeout', function () {
            instance._createTimeout();
            expect(instance._notificationTimeout).toNotEqual(undefined);
        });

        it('Should set the notification hidden when it\'s timeout expires', function () {
            var selector = {hidden: true};
            var collectionSize = notificationsCollection.find(selector).count();
            instance._createTimeout();
            clock.tick(1999);
            expect(notificationsCollection.find(selector).count()).toEqual(collectionSize);
            clock.tick(2000);

            expect(notificationsCollection.find(selector).count()).toEqual(collectionSize + 1);
        });
    });

    describe('#getNotificationClass', function () {
        it('Should return the className for the given type', function () {
            expect(instance.getNotificationClass(instance.TYPES.ERROR)).toEqual('error');
            expect(instance.getNotificationClass(instance.TYPES.WARNING)).toEqual('warning');
            expect(instance.getNotificationClass(instance.TYPES.INFO)).toEqual('info');
            expect(instance.getNotificationClass(instance.TYPES.SUCCESS)).toEqual('success');
        });
    });

    describe('#hide', function () {
        describe('Called with an _id', function () {
            var testNotification, testId;

            beforeEach(function () {
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

            it('Should set the notification hidden', function () {
                instance.hide(testId);
                expect(notificationsCollection.findOne({_id: testId}).hidden).toEqual(true);
            });

            it('Should not set other notifications hidden', function () {
                instance.hide(testId);
                expect(notificationsCollection.find({hidden: true}).count()).toEqual(1);
            });
        });
    });

    describe('#remove', function () {
        describe('Called with an selector', function () {
            var testNotification, testId;

            beforeEach(function () {
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

                expect(notificationsCollection.find().count()).toEqual(size - 1);
                expect(notificationsCollection.findOne({_id: testId})).toBeUndefined();
            });
        });
    });
});