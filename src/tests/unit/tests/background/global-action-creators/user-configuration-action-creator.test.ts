// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    BaseActionPayload,
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from 'background/actions/action-payloads';
import { UserConfigurationActions } from 'background/actions/user-configuration-actions';
import { UserConfigurationActionCreator } from 'background/global-action-creators/user-configuration-action-creator';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { IMock, Mock, Times } from 'typemoq';
import * as TelemetryEvents from '../../../../../common/extension-telemetry-events';
import { createAsyncActionMock } from './action-creator-test-helpers';

describe('UserConfigurationActionCreator', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('handles GetCurrentState message', async () => {
        const getCurrentStateMock = createAsyncActionMock<void>(undefined);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.getUserConfigurationState();

        getCurrentStateMock.verifyAll();
    });

    it('should SetTelemetryConfig message', async () => {
        const setTelemetryState = true;

        const setTelemetryStateMock = createAsyncActionMock(setTelemetryState);
        const actionsMock = createActionsMock('setTelemetryState', setTelemetryStateMock.object);
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setTelemetryState(setTelemetryState);

        setTelemetryStateMock.verifyAll();
    });

    it('should SetHighContrastConfig message', async () => {
        const payload: SetHighContrastModePayload = {
            enableHighContrast: true,
        };
        const setHighContrastConfigMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'setHighContrastMode',
            setHighContrastConfigMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setHighContrastMode(payload);

        setHighContrastConfigMock.verifyAll();
    });

    it('should SetHighContrastConfig message', async () => {
        const payload: SetNativeHighContrastModePayload = {
            enableHighContrast: true,
        };
        const setNativeHighContrastConfigMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'setNativeHighContrastMode',
            setNativeHighContrastConfigMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setNativeHighContrastMode(payload);

        setNativeHighContrastConfigMock.verifyAll();
    });

    it('should SetBugService message', async () => {
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName: 'none',
        };
        const setBugServiceMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock('setIssueFilingService', setBugServiceMock.object);
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setIssueFilingService(payload);

        setBugServiceMock.verifyAll();
    });

    it('should SetBugServiceProperty message', async () => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const setIssueFilingServicePropertyMock = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'setIssueFilingServiceProperty',
            setIssueFilingServicePropertyMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setIssueFilingServiceProperty(payload);

        setIssueFilingServicePropertyMock.verifyAll();
    });

    it('should SaveIssueFilingSettings message', async () => {
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName: 'test bug service',
            issueFilingSettings: { name: 'issueFilingSettings' },
        };
        const setIssueFilingSettings = createAsyncActionMock(payload);
        const actionsMock = createActionsMock(
            'saveIssueFilingSettings',
            setIssueFilingSettings.object,
        );
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.saveIssueFilingSettings(payload);

        setIssueFilingSettings.verifyAll();
    });

    it('should SetAdbLocation Message', async () => {
        const expectedAdbLocation = 'Somewhere over the rainbow';

        const setAdbLocationConfigMock = createAsyncActionMock(
            expectedAdbLocation,
            'UserConfigurationActionCreator',
        );
        const actionsMock = createActionsMock('setAdbLocation', setAdbLocationConfigMock.object);
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setAdbLocation(expectedAdbLocation);

        setAdbLocationConfigMock.verifyAll();
    });

    it('should SetAutoDetectedFailuresDialogState Message', async () => {
        const expectedDialogState = { enabled: false };
        const expectedPayload = expectedDialogState as BaseActionPayload;

        const dialogStateConfigMock = createAsyncActionMock(expectedDialogState);
        const actionsMock = createActionsMock(
            'setAutoDetectedFailuresDialogState',
            dialogStateConfigMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setAutoDetectedFailuresDialogState(expectedDialogState);

        dialogStateConfigMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.SET_AUTO_DETECTED_FAILURES_DIALOG_STATE,
                    expectedPayload,
                ),
            Times.once(),
        );
    });

    it('should publish telemetry and invoke the corresponding action in response to SetSaveAssessmentDialogState message', async () => {
        const expectedDialogState = { enabled: false };
        const expectedPayload = expectedDialogState as BaseActionPayload;

        const dialogStateConfigMock = createAsyncActionMock(expectedDialogState);
        const actionsMock = createActionsMock(
            'setSaveAssessmentDialogState',
            dialogStateConfigMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        await testSubject.setSaveAssessmentDialogState(expectedDialogState);

        dialogStateConfigMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler =>
                handler.publishTelemetry(
                    TelemetryEvents.SET_SAVE_ASSESSMENT_DIALOG_STATE,
                    expectedPayload,
                ),
            Times.once(),
        );
    });

    function createActionsMock<ActionName extends keyof UserConfigurationActions>(
        actionName: ActionName,
        action: UserConfigurationActions[ActionName],
    ): IMock<UserConfigurationActions> {
        const actionsMock = Mock.ofType<UserConfigurationActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
