// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagChecker } from 'background/feature-flag-checker';
import {
    ApplicationTelemetryData,
    ApplicationTelemetryDataFactory,
} from 'background/telemetry/application-telemetry-data-factory';
import { DebugToolsTelemetryClient } from 'background/telemetry/debug-tools-telemetry-client';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { FeatureFlags } from 'common/feature-flags';
import { Messages } from 'common/messages';
import { IMock, It, Mock, Times } from 'typemoq';

describe('DebugToolsTelemetryClient', () => {
    let debugToolsFeatureFlag: boolean;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let telemetryDataFactoryMock: IMock<ApplicationTelemetryDataFactory>;
    const featureFlagChecker: FeatureFlagChecker = {
        isEnabled: feature => feature === FeatureFlags.debugTools && debugToolsFeatureFlag,
    };

    let testSubject: DebugToolsTelemetryClient;

    beforeEach(() => {
        debugToolsFeatureFlag = true;
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryDataFactoryMock = Mock.ofType<ApplicationTelemetryDataFactory>();

        testSubject = new DebugToolsTelemetryClient(
            browserAdapterMock.object,
            telemetryDataFactoryMock.object,
        );
        testSubject.initialize(featureFlagChecker);
    });

    afterEach(() => {
        browserAdapterMock.verifyAll();
    });

    describe('enableTelemetry', () => {
        beforeEach(() => {
            testSubject = new DebugToolsTelemetryClient(null, null);
        });

        it('no op, no side effects', () => {
            const action = () => testSubject.enableTelemetry();

            expect(action).not.toThrow();
        });
    });

    describe('disableTelemetry', () => {
        beforeEach(() => {
            testSubject = new DebugToolsTelemetryClient(null, null);
        });

        it('no op, no side effects', () => {
            const action = () => testSubject.disableTelemetry();

            expect(action).not.toThrow();
        });
    });

    describe('trackEvent', () => {
        const eventName = 'test-event-name';
        const eventProperties = { testProperty: 'testValue' };

        it('is no op when feature flag is disabled', () => {
            debugToolsFeatureFlag = false;

            testSubject = new DebugToolsTelemetryClient(null, null);
            testSubject.initialize(featureFlagChecker);

            browserAdapterMock
                .setup(b => b.sendRuntimeMessage(It.isAny()))
                .verifiable(Times.never());

            const action = () => testSubject.trackEvent(eventName, eventProperties);

            expect(action).not.toThrow();
        });

        it('send runtime message if feature flag is enabled', async () => {
            const appData: ApplicationTelemetryData = {
                applicationBuild: 'test-application-build',
                applicationName: 'test-application-name',
                applicationVersion: 'test-application-version',
                installationId: 'test-installation-id',
            };
            const expectedMessage = {
                messageType: Messages.DebugTools.Telemetry,
                name: eventName,
                properties: {
                    ...eventProperties,
                    ...appData,
                },
            };

            telemetryDataFactoryMock.setup(factory => factory.getData()).returns(() => appData);
            browserAdapterMock.setup(b => b.sendRuntimeMessage(expectedMessage)).verifiable();

            await testSubject.trackEvent(eventName, eventProperties);
        });
    });
});
