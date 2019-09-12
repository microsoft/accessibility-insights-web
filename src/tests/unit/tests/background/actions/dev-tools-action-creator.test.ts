// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectElementPayload, InspectFrameUrlPayload, OnDevToolOpenPayload } from 'background/actions/action-payloads';
import { DevToolsActionCreator } from 'background/actions/dev-tools-action-creator';
import { DevToolActions } from 'background/actions/dev-tools-actions';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import * as TelemetryEvents from '../../../../../common/telemetry-events';
import { createActionMock } from '../global-action-creators/action-creator-test-helpers';

describe('DevToolsActionCreatorTest', () => {
    const tabId: number = -1;
    let devtoolActionsMock: IMock<DevToolActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let registerTypeToPayloadCallback: IMock<RegisterTypeToPayloadCallback>;

    let testObject: DevToolsActionCreator;

    beforeEach(() => {
        devtoolActionsMock = Mock.ofType(DevToolActions, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        registerTypeToPayloadCallback = Mock.ofInstance((payloadType, callback) => {});

        testObject = new DevToolsActionCreator(
            devtoolActionsMock.object,
            telemetryEventHandlerMock.object,
            registerTypeToPayloadCallback.object,
        );
    });

    test('on DevtoolStatus', () => {
        const payload: OnDevToolOpenPayload = {
            status: true,
        };

        const setDevToolsStateAction = createActionMock(payload.status);

        setupDevToolsActionsMock('setDevToolState', setDevToolsStateAction);

        setupRegisterTypeToPayloadCallbackMock(Messages.DevTools.DevtoolStatus, payload, tabId);

        testObject.registerCallbacks();

        setDevToolsStateAction.verifyAll();
    });

    test('on Get', () => {
        const getCurrentStateAction = createActionMock(null);

        setupDevToolsActionsMock('getCurrentState', getCurrentStateAction);

        setupRegisterTypeToPayloadCallbackMock(getStoreStateMessage(StoreNames.DevToolsStore), null, tabId);

        testObject.registerCallbacks();

        getCurrentStateAction.verifyAll();
    });

    test('on InspectFrameUrl', () => {
        const payload: InspectFrameUrlPayload = {
            frameUrl: 'frame-url',
        };

        const setFrameUrlAction = createActionMock(payload.frameUrl);

        setupDevToolsActionsMock('setFrameUrl', setFrameUrlAction);

        setupRegisterTypeToPayloadCallbackMock(Messages.DevTools.InspectFrameUrl, payload, tabId);

        testObject.registerCallbacks();

        setFrameUrlAction.verifyAll();
    });

    test('InspectElement', () => {
        const payload: InspectElementPayload = {
            target: ['target'],
        };

        telemetryEventHandlerMock
            .setup(publisher => publisher.publishTelemetry(TelemetryEvents.INSPECT_OPEN, payload))
            .verifiable(Times.once());

        const setInspectElementAction = createActionMock(payload.target);

        setupDevToolsActionsMock('setInspectElement', setInspectElementAction);

        setupRegisterTypeToPayloadCallbackMock(Messages.DevTools.InspectElement, payload, tabId);

        testObject.registerCallbacks();

        setInspectElementAction.verifyAll();
        telemetryEventHandlerMock.verifyAll();
    });

    function setupDevToolsActionsMock(actionName: keyof DevToolActions, actionMock: IMock<Action<any>>): void {
        devtoolActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, payload: any, listeningTabId: number): void {
        registerTypeToPayloadCallback
            .setup(registrar => registrar(message, It.is(_.isFunction)))
            .callback((passedMessage, listener) => listener(payload, listeningTabId));
    }
});
