// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
    SetTelemetryStatePayload,
} from 'background/actions/action-payloads';
import { AutoDetectedFailuresDialogStateTelemetryData } from 'common/extension-telemetry-events';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { TelemetryDataFactory } from 'common/telemetry-data-factory';
import { Mock, Times } from 'typemoq';

import { Message } from '../../../../../common/message';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { Messages } from '../../../../../common/messages';
import { IssueFilingServiceProperties } from '../../../../../common/types/store-data/user-configuration-store';

describe('UserConfigMessageCreator', () => {
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    const telemetryFactoryMock = Mock.ofType<TelemetryDataFactory>();
    let testSubject: UserConfigMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        telemetryFactoryMock.reset();
        testSubject = new UserConfigMessageCreator(
            dispatcherMock.object,
            telemetryFactoryMock.object,
        );
    });

    it('dispatches message for setTelemetryState', () => {
        const enableTelemetry = false;
        const payload: SetTelemetryStatePayload = {
            enableTelemetry,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetTelemetryConfig,
            payload,
        };

        testSubject.setTelemetryState(enableTelemetry);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for setHighContrastModeConfig', () => {
        const enableHighContrast = true;
        const payload: SetHighContrastModePayload = {
            enableHighContrast,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetHighContrastConfig,
            payload,
        };

        testSubject.setHighContrastMode(enableHighContrast);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for setNativeHighContrastModeConfig', () => {
        const enableHighContrast = true;
        const payload: SetNativeHighContrastModePayload = {
            enableHighContrast,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetNativeHighContrastConfig,
            payload,
        };

        testSubject.setNativeHighContrastMode(enableHighContrast);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for setIssueFilingService', () => {
        const issueFilingServiceName = 'UserConfigMessageCreatorTest bug service name';
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetIssueFilingService,
            payload,
        };

        testSubject.setIssueFilingService(payload);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for setIssueFilingServiceProperty', () => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetIssueFilingServiceProperty,
            payload,
        };

        testSubject.setIssueFilingServiceProperty(payload);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for saveIssueFilingSettings', () => {
        const issueFilingServiceName = 'UserConfigMessageCreatorTest bug service name';
        const issueFilingSettings: IssueFilingServiceProperties = { name: 'issueFilingSettings' };
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName,
            issueFilingSettings: issueFilingSettings,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SaveIssueFilingSettings,
            payload,
        };

        testSubject.saveIssueFilingSettings(payload);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for saveWindowBounds', () => {
        const payload: SaveWindowBoundsPayload = {
            windowState: 'full-screen',
            windowBounds: undefined,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SaveWindowBounds,
            payload,
        };

        testSubject.saveWindowBounds(payload);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });

    it('dispatches message for setAutoDetectedFailuresDialogState', () => {
        const enabled = false;
        const telemetry: AutoDetectedFailuresDialogStateTelemetryData = {
            enabled,
        };
        const payload: AutoDetectedFailuresDialogStatePayload = {
            enabled,
            telemetry,
        };
        const expectedMessage: Message = {
            messageType: Messages.UserConfig.SetAutoDetectedFailuresDialogState,
            payload,
        };

        telemetryFactoryMock
            .setup(tf => tf.forSetAutoDetectedFailuresDialogState(enabled))
            .returns(() => telemetry)
            .verifiable(Times.once());

        testSubject.setAutoDetectedFailuresDialogState(enabled);

        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
        telemetryFactoryMock.verifyAll();
    });
});
