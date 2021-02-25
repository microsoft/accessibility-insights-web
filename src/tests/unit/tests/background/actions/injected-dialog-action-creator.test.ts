// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectedDialogOpenPayload } from 'background/actions/action-payloads';
import { InjectedDialogActionCreator } from 'background/actions/injected-dialog-action-creator';
import { InjectedDialogActions } from 'background/actions/injected-dialog-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';
import { IMock, It, Mock, Times } from 'typemoq';

import {
    createActionMock,
    createInterpreterMock,
} from '../global-action-creators/action-creator-test-helpers';

describe('InjectedDialogActionCreator', () => {
    const tabId = -2;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
    });

    it('propagates InjectedDialog.Open messages with telemetry', () => {
        const payload: InjectedDialogOpenPayload = {
            target: ['test', 'target'],
        };
        const openDialogMock = createActionMock(payload);
        const actionsMock = createActionsMock('openDialog', openDialogMock.object);

        const interpreterMock = createInterpreterMock(Messages.InjectedDialog.Open, payload, tabId);

        const testSubject = new InjectedDialogActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        openDialogMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(TelemetryEvents.ISSUES_DIALOG_OPENED, payload),
            Times.once(),
        );
    });

    it('propagates InjectedDialog.Close messages without telemetry', () => {
        const closeDialogMock = createActionMock(undefined);
        const actionsMock = createActionsMock('closeDialog', closeDialogMock.object);

        const interpreterMock = createInterpreterMock(Messages.InjectedDialog.Close, null, tabId);

        const testSubject = new InjectedDialogActionCreator(
            interpreterMock.object,
            actionsMock.object,
            telemetryEventHandlerMock.object,
        );

        testSubject.registerCallbacks();

        closeDialogMock.verifyAll();
        telemetryEventHandlerMock.verify(
            handler => handler.publishTelemetry(It.isAny(), It.isAny()),
            Times.never(),
        );
    });

    function createActionsMock<ActionName extends keyof InjectedDialogActions>(
        actionName: ActionName,
        action: InjectedDialogActions[ActionName],
    ): IMock<InjectedDialogActions> {
        const actionsMock = Mock.ofType<InjectedDialogActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
