// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { AssessmentVisualizationConfiguration } from 'common/configs/assessment-visualization-configuration';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { VisualizationType } from 'common/types/visualization-type';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Notifications } from 'webextension-polyfill';

type GetNotificationMessage = AssessmentVisualizationConfiguration['getNotificationMessage'];

describe('NotificationCreator', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let getNotificationMessageMock: IMock<GetNotificationMessage>;
    let loggerMock: IMock<Logger>;
    let testObject: NotificationCreator;

    const partialCreateNotificationOptions: Partial<Notifications.CreateNotificationOptions> = {
        type: 'basic',
        title: 'test-name',
        iconUrl: '../iconUrl',
    };

    const notificationMessage = 'the-message';
    const testNotificationId = 'the-notification-id';
    const key: string = 'the-key';
    const visualizationType: VisualizationType = -1 as VisualizationType;
    const manifestStub: chrome.runtime.Manifest = {
        name: 'test-name',
        icons: { 128: 'iconUrl' },
    } as any;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        configFactoryMock = Mock.ofType<VisualizationConfigurationFactory>(
            undefined,
            MockBehavior.Strict,
        );
        getNotificationMessageMock = Mock.ofType<GetNotificationMessage>();
        loggerMock = Mock.ofType<Logger>();
        testObject = new NotificationCreator(
            browserAdapterMock.object,
            configFactoryMock.object,
            loggerMock.object,
        );
    });

    describe('createNotification', () => {
        it.each([null, undefined])(
            'does not creates a notification if there is no message (=%p)',
            message => {
                testObject.createNotification(message);
                verifyAll();
            },
        );

        describe('with message', () => {
            const notificationOptions: Notifications.CreateNotificationOptions = {
                ...partialCreateNotificationOptions,
                message: notificationMessage,
            } as Notifications.CreateNotificationOptions;

            beforeEach(() => {
                browserAdapterMock
                    .setup(adapter => adapter.getManifest())
                    .returns(() => manifestStub);
            });

            it('creates the notification with the proper information', () => {
                browserAdapterMock
                    .setup(adapter => adapter.createNotification(It.isValue(notificationOptions)))
                    .returns(() => Promise.resolve('test-notification-id'))
                    .verifiable(Times.once());

                testObject.createNotification(notificationMessage);

                verifyAll();
            });

            it('logs the error when the browser adapter api call fails', () => {
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

    it('create a notification from visualization information', () => {
        browserAdapterMock.setup(adapter => adapter.getManifest()).returns(() => manifestStub);

        browserAdapterMock
            .setup(adapter =>
                adapter.createNotification(
                    It.isValue({
                        ...partialCreateNotificationOptions,
                        message: notificationMessage,
                    } as Notifications.CreateNotificationOptions),
                ),
            )
            .returns(() => Promise.resolve(testNotificationId))
            .verifiable(Times.once());

        const selectorStub = {};
        getNotificationMessageMock
            .setup(mock => mock(It.isValue(selectorStub), key, It.isValue([])))
            .returns(() => notificationMessage)
            .verifiable(Times.once());

        configFactoryMock
            .setup(cf => cf.getConfiguration(visualizationType))
            .returns(() => {
                return {
                    getNotificationMessage: getNotificationMessageMock.object,
                } as VisualizationConfiguration;
            });

        testObject.createNotificationByVisualizationKey(selectorStub, key, visualizationType, []);

        getNotificationMessageMock.verifyAll();
        verifyAll();
    });

    function verifyAll(): void {
        browserAdapterMock.verifyAll();
        configFactoryMock.verifyAll();
    }
});
