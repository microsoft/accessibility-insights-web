// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { VisualizationType } from 'common/types/visualization-type';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Notifications } from 'webextension-polyfill-ts';

describe('NotificationCreator', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let getNotificationMessageMock: IMock<(selectorMap, key) => string>;
    let loggerMock: IMock<Logger>;
    let testObject: NotificationCreator;

    const key: string = 'the-key';
    const visualizationType: VisualizationType = -1;
    const manifestStub: chrome.runtime.Manifest = { name: 'testname', icons: { 128: 'iconUrl' } } as any;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        configFactoryMock = Mock.ofType(VisualizationConfigurationFactory, MockBehavior.Strict);
        getNotificationMessageMock = Mock.ofInstance(selector => null);
        loggerMock = Mock.ofType<Logger>();
        testObject = new NotificationCreator(browserAdapterMock.object, configFactoryMock.object, loggerMock.object);
    });

    describe('createNotification', () => {
        test('no message', () => {
            testObject.createNotification(null);
            verifyAll();
        });

        describe('with message', () => {
            const notificationMessage = 'the-message';
            const notificationOptions: Notifications.CreateNotificationOptions = {
                type: 'basic',
                message: notificationMessage,
                title: 'testname',
                iconUrl: '../iconUrl',
            };

            beforeEach(() => {
                browserAdapterMock.setup(adapter => adapter.getManifest()).returns(() => manifestStub);
            });

            test('is created', () => {
                browserAdapterMock
                    .setup(adapter => adapter.createNotification(It.isValue(notificationOptions)))
                    .returns(() => Promise.resolve('test-notification-id'))
                    .verifiable(Times.once());

                testObject.createNotification(notificationMessage);

                verifyAll();
            });

            test('fails', () => {
                const errorMessage = 'dummy error';

                browserAdapterMock
                    .setup(adapter => adapter.createNotification(It.isValue(notificationOptions)))
                    .returns(() => Promise.reject(errorMessage))
                    .verifiable(Times.once());

                testObject.createNotification(notificationMessage);

                loggerMock.verify(logger => logger.error(errorMessage), Times.once());
                verifyAll();
            });
        });
    });

    test('createNotificationByVisualizationKey, happy path', () => {
        const notificationMessage = 'the-message';

        browserAdapterMock.setup(adapter => adapter.getManifest()).returns(() => manifestStub);

        browserAdapterMock
            .setup(adapter =>
                adapter.createNotification(
                    It.isValue({
                        type: 'basic',
                        message: notificationMessage,
                        title: 'testname',
                        iconUrl: '../iconUrl',
                    }),
                ),
            )
            .returns(() => Promise.resolve('test-notification-id'))
            .verifiable(Times.once());

        const selectorStub = {};
        getNotificationMessageMock
            .setup(mock => mock(It.isValue(selectorStub), key))
            .returns(() => notificationMessage)
            .verifiable(Times.once());

        configFactoryMock
            .setup(cf => cf.getConfiguration(visualizationType))
            .returns(() => {
                return {
                    getNotificationMessage: getNotificationMessageMock.object,
                } as VisualizationConfiguration;
            });

        testObject.createNotificationByVisualizationKey(selectorStub, key, visualizationType);

        getNotificationMessageMock.verifyAll();
        verifyAll();
    });

    function verifyAll(): void {
        browserAdapterMock.verifyAll();
        configFactoryMock.verifyAll();
    }
});
