// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { PermissionsStateActionCreator } from 'background/global-action-creators/permissions-state-action-creator';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryData } from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { IMock, Mock } from 'typemoq';

import { createActionMock, createInterpreterMock } from './action-creator-test-helpers';

describe('PermissionsStateActionCreator', () => {
    let permissionsStateActionsMock: IMock<PermissionsStateActions>;

    beforeEach(() => {
        permissionsStateActionsMock = Mock.ofType<PermissionsStateActions>();
    });

    it('handles getStoreState message', () => {
        const expectedMessage = getStoreStateMessage(StoreNames.PermissionsStateStore);
        const interpreterMock = createInterpreterMock(expectedMessage, null);
        const getCurrentStateMock = createActionMock(undefined);
        setupActionsMock('getCurrentState', getCurrentStateMock.object);
        const testSubject = new PermissionsStateActionCreator(
            interpreterMock.object,
            permissionsStateActionsMock.object,
            null,
        );

        testSubject.registerCallbacks();

        getCurrentStateMock.verifyAll();
    });

    it.each([true, false])(
        'handles SetPermissionsState message for payload %p',
        (permissionState: boolean) => {
            const expectedMessage = Messages.PermissionsState.SetPermissionsState;
            const payload: SetAllUrlsPermissionStatePayload = {
                hasAllUrlAndFilePermissions: permissionState,
                telemetry: {} as TelemetryData,
            };
            const interpreterMock = createInterpreterMock(expectedMessage, payload);
            const setPermissionsStateMock = createActionMock(payload);
            const telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
            setupActionsMock('setPermissionsState', setPermissionsStateMock.object);
            const testSubject = new PermissionsStateActionCreator(
                interpreterMock.object,
                permissionsStateActionsMock.object,
                telemetryEventHandlerMock.object,
            );

            testSubject.registerCallbacks();

            setPermissionsStateMock.verifyAll();
        },
    );

    const setupActionsMock = <ActionName extends keyof PermissionsStateActions>(
        actionName: ActionName,
        action: PermissionsStateActions[ActionName],
    ) => {
        permissionsStateActionsMock.setup(actions => actions[actionName]).returns(() => action);
    };
});
