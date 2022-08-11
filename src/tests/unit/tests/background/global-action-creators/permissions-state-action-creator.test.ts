// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { PermissionsStateActionCreator } from 'background/global-action-creators/permissions-state-action-creator';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryData } from 'common/extension-telemetry-events';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock } from 'typemoq';
import { createAsyncActionMock } from './action-creator-test-helpers';

describe('PermissionsStateActionCreator', () => {
    let permissionsStateActionsMock: IMock<PermissionsStateActions>;
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        permissionsStateActionsMock = Mock.ofType<PermissionsStateActions>();
        interpreterMock = new MockInterpreter();
    });

    it('handles getStoreState message', async () => {
        const expectedMessage = getStoreStateMessage(StoreNames.PermissionsStateStore);
        const getCurrentStateMock = createAsyncActionMock(undefined);
        setupActionsMock('getCurrentState', getCurrentStateMock.object);
        const testSubject = new PermissionsStateActionCreator(
            interpreterMock.object,
            permissionsStateActionsMock.object,
            null,
        );

        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(expectedMessage, null);

        getCurrentStateMock.verifyAll();
    });

    it.each([true, false])(
        'handles SetPermissionsState message for payload %p',
        async (permissionState: boolean) => {
            const expectedMessage = Messages.PermissionsState.SetPermissionsState;
            const payload: SetAllUrlsPermissionStatePayload = {
                hasAllUrlAndFilePermissions: permissionState,
                telemetry: {} as TelemetryData,
            };
            const setPermissionsStateMock = createAsyncActionMock(payload);
            const telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
            setupActionsMock('setPermissionsState', setPermissionsStateMock.object);
            const testSubject = new PermissionsStateActionCreator(
                interpreterMock.object,
                permissionsStateActionsMock.object,
                telemetryEventHandlerMock.object,
            );

            testSubject.registerCallbacks();

            await interpreterMock.simulateMessage(expectedMessage, payload);

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
