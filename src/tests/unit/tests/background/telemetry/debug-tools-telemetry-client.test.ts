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
    let stubAppData: ApplicationTelemetryData;
    const featureFlagChecker: FeatureFlagChecker = {
        isEnabled: feature => feature === FeatureFlags.debugTools && debugToolsFeatureFlag,
    };

    let testSubject: DebugToolsTelemetryClient;

    beforeEach(() => {
        debugToolsFeatureFlag = true;
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        telemetryDataFactoryMock = Mock.ofType<ApplicationTelemetryDataFactory>();

        stubAppData = {
            applicationBuild: 'test-application-build',
            applicationName: 'test-application-name',
            applicationVersion: 'test-application-version',
            installationId: 'test-installation-id',
        };

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

        it('sends runtime message if feature flag is enabled', () => {
            const expectedMessage = {
                messageType: Messages.DebugTools.Telemetry,
                name: eventName,
                properties: {
                    ...eventProperties,
                    ...stubAppData,
                },
            };

            telemetryDataFactoryMock.setup(factory => factory.getData()).returns(() => stubAppData);
            browserAdapterMock
                .setup(b => b.sendRuntimeMessage(expectedMessage))
                .returns(() => Promise.resolve())
                .verifiable();

            testSubject.trackEvent(eventName, eventProperties);
        });

        it('ignores errors from browserAdapter.sendRuntimeMessage', () => {
            telemetryDataFactoryMock.setup(factory => factory.getData()).returns(() => stubAppData);
            browserAdapterMock
                .setup(b => b.sendRuntimeMessage(It.isAny()))
                .returns(() => Promise.reject('error from sendRuntimeMessage'))
                .verifiable();

            testSubject.trackEvent(eventName, eventProperties);

            // The actual test is that Jest shouldn't emit any "unhandled promise rejection" error
        });
    });
});
