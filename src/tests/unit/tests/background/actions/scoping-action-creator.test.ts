// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BaseActionPayload } from '../../../../../background/actions/action-payloads';
import { ScopingActionCreator } from '../../../../../background/actions/scoping-action-creator';
import { ScopingActions } from '../../../../../background/actions/scoping-actions';
import { DetailsViewController } from '../../../../../background/details-view-controller';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { Action } from '../../../../../common/flux/action';
import { RegisterTypeToPayloadCallback } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { SCOPING_CLOSE, SCOPING_OPEN } from '../../../../../common/telemetry-events';

describe('ScopingActionCreatorTest', () => {
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;
    let scopingActionsMock: IMock<ScopingActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let detailsViewControllerStrictMock: IMock<DetailsViewController>;
    const tabId = -1;
    let testObject: ScopingActionCreator;

    beforeEach(() => {
        scopingActionsMock = Mock.ofType(ScopingActions, MockBehavior.Strict);
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);
        detailsViewControllerStrictMock = Mock.ofType<DetailsViewController>(null, MockBehavior.Strict);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((theType, callback) => {});

        testObject = new ScopingActionCreator(
            scopingActionsMock.object,
            telemetryEventHandlerMock.object,
            registerTypeToPayloadCallbackMock.object,
            detailsViewControllerStrictMock.object,
        );
    });

    test('on OpenPanel', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock.setup(tp => tp.publishTelemetry(SCOPING_OPEN, payload)).verifiable(Times.once());

        detailsViewControllerStrictMock.setup(dc => dc.showDetailsView(tabId)).verifiable(Times.once());

        const actionMock = createActionMock(null);
        setupScopingActionsMock('openScopingPanel', actionMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.Scoping.OpenPanel, payload, tabId);

        testObject.registerCallbacks();
        actionMock.verifyAll();

        telemetryEventHandlerMock.verifyAll();
        detailsViewControllerStrictMock.verifyAll();
    });

    test('on ClosePanel', () => {
        const payload: BaseActionPayload = {};

        telemetryEventHandlerMock.setup(tp => tp.publishTelemetry(SCOPING_CLOSE, payload)).verifiable(Times.once());

        const closeScopingPanelActionMock = createActionMock(null);
        setupScopingActionsMock('closeScopingPanel', closeScopingPanelActionMock);
        setupRegisterTypeToPayloadCallbackMock(Messages.Scoping.ClosePanel, payload, tabId);

        testObject.registerCallbacks();
        closeScopingPanelActionMock.verifyAll();

        telemetryEventHandlerMock.verifyAll();
    });

    function createActionMock<T>(actionPayload: T): IMock<Action<T>> {
        const actionMock = Mock.ofType<Action<T>>(Action);
        actionMock.setup(action => action.invoke(actionPayload)).verifiable(Times.once());

        return actionMock;
    }

    function setupScopingActionsMock(actionName: keyof ScopingActions, actionMock: IMock<Action<any>>): void {
        scopingActionsMock.setup(actions => actions[actionName]).returns(() => actionMock.object);
    }

    function setupRegisterTypeToPayloadCallbackMock(message: string, actionPayload: any, _tabId: number): void {
        registerTypeToPayloadCallbackMock
            .setup(regitrar => regitrar(message, It.is(param => _.isFunction(param))))
            .callback((_message, handler) => handler(actionPayload, _tabId));
    }
});
