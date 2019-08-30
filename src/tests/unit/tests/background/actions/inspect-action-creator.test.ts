// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { InspectActionCreator } from 'background/actions/inspect-action-creator';
import { InspectActions, InspectPayload } from 'background/actions/inspect-actions';
import { InspectMode } from 'background/inspect-modes';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { BrowserAdapter } from '../../../../../common/browser-adapters/browser-adapter';
import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import * as TelemetryEvents from '../../../../../common/telemetry-events';

describe('InspectActionCreatorTest', () => {
    const tabId: number = -1;
    let inspectActionsMock: IMock<InspectActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;
    let browserAdapterMock: IMock<BrowserAdapter>;

    let testObject: InspectActionCreator;

    beforeAll(() => {
        inspectActionsMock = Mock.ofType(InspectActions, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((payloadType, callback) => {});

        testObject = new InspectActionCreator(
            inspectActionsMock.object,
            telemetryEventHandlerMock.object,
            browserAdapterMock.object,
            registerTypeToPayloadCallbackMock.object,
        );
    });

    test('onGetInspectCurrentState', () => {
        const getCurrentStateMock = createActionMock(null);

        setupInspectActionMock('getCurrentState', getCurrentStateMock);

        setupRegisterTypeToPayloadCallbackMock(getStoreStateMessage(StoreNames.InspectStore), null, tabId);

        testObject.registerCallbacks();
        getCurrentStateMock.verifyAll();
    });

    test('onChangeInspectMode', () => {
        const payload: InspectPayload = {
            inspectMode: InspectMode.scopingAddInclude,
        };

        telemetryEventHandlerMock
            .setup(publisher => publisher.publishTelemetry(TelemetryEvents.CHANGE_INSPECT_MODE, payload))
            .verifiable(Times.once());

        browserAdapterMock.setup(ba => ba.switchToTab(tabId)).verifiable(Times.once());

        const changeInspectModeMock = createActionMock(payload);

        setupInspectActionMock('changeInspectMode', changeInspectModeMock);

        setupRegisterTypeToPayloadCallbackMock(Messages.Inspect.ChangeInspectMode, payload, tabId);

        testObject.registerCallbacks();
        changeInspectModeMock.verifyAll();
    });

    function createActionMock<TPayload>(actionPayload: TPayload): IMock<Action<TPayload>> {
        const getCurrentStateMock = Mock.ofType<Action<TPayload>>(Action, MockBehavior.Strict);
        getCurrentStateMock.setup(action => action.invoke(actionPayload)).verifiable(Times.once());

        return getCurrentStateMock;
    }

    function setupInspectActionMock(actionName: keyof InspectActions, actionMock: IMock<Action<any>>): void {
        inspectActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, payload: any, listeningTabId: number): void {
        registerTypeToPayloadCallbackMock
            .setup(registrar => registrar(message, It.is(_.isFunction)))
            .callback((passedMessage, listener) => listener(payload, listeningTabId));
    }
});
