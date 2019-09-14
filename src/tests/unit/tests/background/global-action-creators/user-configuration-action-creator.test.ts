// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetTelemetryStatePayload,
} from 'background/actions/action-payloads';
import { UserConfigurationActions } from 'background/actions/user-configuration-actions';
import { UserConfigurationActionCreator } from 'background/global-action-creators/user-configuration-action-creator';
import { IMock, Mock } from 'typemoq';

import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import { TelemetryEventSource, TriggeredBy } from '../../../../../common/telemetry-events';
import { createActionMock, createInterpreterMock } from './action-creator-test-helpers';

describe('UserConfigurationActionCreator', () => {
    it('handles GetCurrentState message', () => {
        const payload = null;
        const getCurrentStateMock = createActionMock<null>(payload);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const interpreterMock = createInterpreterMock(getStoreStateMessage(StoreNames.UserConfigurationStore), payload);
        const testSubject = new UserConfigurationActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallback();

        getCurrentStateMock.verifyAll();
    });

    it('should SetTelemetryConfig message', () => {
        const payload: SetTelemetryStatePayload = {
            enableTelemetry: true,
            telemetry: {
                triggeredBy: 'test' as TriggeredBy,
                source: -1 as TelemetryEventSource,
            },
        };
        const setTelemetryStateMock = createActionMock(payload);
        const actionsMock = createActionsMock('setTelemetryState', setTelemetryStateMock.object);
        const interpreterMock = createInterpreterMock(Messages.UserConfig.SetTelemetryConfig, payload);
        const testSubject = new UserConfigurationActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallback();

        setTelemetryStateMock.verifyAll();
    });

    it('should SetHighContrastConfig message', () => {
        const payload: SetHighContrastModePayload = {
            enableHighContrast: true,
        };
        const setHighContrastConfigMock = createActionMock(payload);
        const actionsMock = createActionsMock('setHighContrastMode', setHighContrastConfigMock.object);
        const interpreterMock = createInterpreterMock(Messages.UserConfig.SetHighContrastConfig, payload);
        const testSubject = new UserConfigurationActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallback();

        setHighContrastConfigMock.verifyAll();
    });

    it('should SetBugService message', () => {
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName: 'none',
        };
        const setBugServiceMock = createActionMock(payload);
        const actionsMock = createActionsMock('setIssueFilingService', setBugServiceMock.object);
        const interpreterMock = createInterpreterMock(Messages.UserConfig.SetIssueFilingService, payload);
        const testSubject = new UserConfigurationActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallback();

        setBugServiceMock.verifyAll();
    });

    it('should SetBugServiceProperty message', () => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const setIssueFilingServicePropertyMock = createActionMock(payload);
        const actionsMock = createActionsMock('setIssueFilingServiceProperty', setIssueFilingServicePropertyMock.object);
        const interpreterMock = createInterpreterMock(Messages.UserConfig.SetIssueFilingServiceProperty, payload);
        const testSubject = new UserConfigurationActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallback();

        setIssueFilingServicePropertyMock.verifyAll();
    });

    it('should SaveIssueFilingSettings message', () => {
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName: 'test bug service',
            issueFilingSettings: { name: 'issueFilingSettings' },
        };
        const setIssueFilingSettings = createActionMock(payload);
        const actionsMock = createActionsMock('saveIssueFilingSettings', setIssueFilingSettings.object);
        const interpreterMock = createInterpreterMock(Messages.UserConfig.SaveIssueFilingSettings, payload);
        const testSubject = new UserConfigurationActionCreator(interpreterMock.object, actionsMock.object);

        testSubject.registerCallback();

        setIssueFilingSettings.verifyAll();
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
