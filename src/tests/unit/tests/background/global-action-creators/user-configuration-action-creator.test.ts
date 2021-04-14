// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from 'background/actions/action-payloads';
import { UserConfigurationActions } from 'background/actions/user-configuration-actions';
import { UserConfigurationActionCreator } from 'background/global-action-creators/user-configuration-action-creator';
import { IMock, Mock } from 'typemoq';

import { createActionMock } from './action-creator-test-helpers';

describe('UserConfigurationActionCreator', () => {
    it('handles GetCurrentState message', () => {
        const getCurrentStateMock = createActionMock<void>(undefined);
        const actionsMock = createActionsMock('getCurrentState', getCurrentStateMock.object);
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.getUserConfigurationState();

        getCurrentStateMock.verifyAll();
    });

    it('should SetTelemetryConfig message', () => {
        const setTelemetryState = true;

        const setTelemetryStateMock = createActionMock(setTelemetryState);
        const actionsMock = createActionsMock('setTelemetryState', setTelemetryStateMock.object);
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.setTelemetryState(setTelemetryState);

        setTelemetryStateMock.verifyAll();
    });

    it('should SetHighContrastConfig message', () => {
        const payload: SetHighContrastModePayload = {
            enableHighContrast: true,
        };
        const setHighContrastConfigMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'setHighContrastMode',
            setHighContrastConfigMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.setHighContrastMode(payload);

        setHighContrastConfigMock.verifyAll();
    });

    it('should SetHighContrastConfig message', () => {
        const payload: SetNativeHighContrastModePayload = {
            enableHighContrast: true,
        };
        const setNativeHighContrastConfigMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'setNativeHighContrastMode',
            setNativeHighContrastConfigMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.setNativeHighContrastMode(payload);

        setNativeHighContrastConfigMock.verifyAll();
    });

    it('should SetBugService message', () => {
        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName: 'none',
        };
        const setBugServiceMock = createActionMock(payload);
        const actionsMock = createActionsMock('setIssueFilingService', setBugServiceMock.object);
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.setIssueFilingService(payload);

        setBugServiceMock.verifyAll();
    });

    it('should SetBugServiceProperty message', () => {
        const payload: SetIssueFilingServicePropertyPayload = {
            issueFilingServiceName: 'bug-service-name',
            propertyName: 'property-name',
            propertyValue: 'property-value',
        };
        const setIssueFilingServicePropertyMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'setIssueFilingServiceProperty',
            setIssueFilingServicePropertyMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.setIssueFilingServiceProperty(payload);

        setIssueFilingServicePropertyMock.verifyAll();
    });

    it('should SaveIssueFilingSettings message', () => {
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName: 'test bug service',
            issueFilingSettings: { name: 'issueFilingSettings' },
        };
        const setIssueFilingSettings = createActionMock(payload);
        const actionsMock = createActionsMock(
            'saveIssueFilingSettings',
            setIssueFilingSettings.object,
        );
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.saveIssueFilingSettings(payload);

        setIssueFilingSettings.verifyAll();
    });

    it('should SetAdbLocation Message', () => {
        const expectedAdbLocation = 'Somewhere over the rainbow';

        const setAdbLocationConfigMock = createActionMock(
            expectedAdbLocation,
            'UserConfigurationActionCreator',
        );
        const actionsMock = createActionsMock('setAdbLocation', setAdbLocationConfigMock.object);
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.setAdbLocation(expectedAdbLocation);

        setAdbLocationConfigMock.verifyAll();
    });

    it('should SaveWindowBounds message', () => {
        const payload: SaveWindowBoundsPayload = {
            windowState: 'normal',
            windowBounds: { x: 10, y: 20, height: 100, width: 150 },
        };

        const saveWindowBoundsActionMock = createActionMock(payload);
        const actionsMock = createActionsMock(
            'saveWindowBounds',
            saveWindowBoundsActionMock.object,
        );
        const testSubject = new UserConfigurationActionCreator(actionsMock.object);

        testSubject.saveWindowBounds(payload);

        saveWindowBoundsActionMock.verifyAll();
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
