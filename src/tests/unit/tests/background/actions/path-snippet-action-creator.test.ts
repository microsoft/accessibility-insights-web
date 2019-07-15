import { PathSnippetActions } from '../../../../../background/actions/path-snippet-actions';
import { Mock, MockBehavior } from 'typemoq';
import { PathSnippetActionCreator } from '../../../../../background/actions/path-snippet-action-creator';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

describe('PathSnippetActionCreatorTest', () => {
    const tabId: number = -1;
    let pathSnippetActionsMock: IMock<PathSnippetActions>;
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let registerTypeToPayloadCallbackMock: IMock<RegisterTypeToPayloadCallback>;
    let browserAdapterMock: IMock<BrowserAdapter>;

    let testObject: InspectActionCreator;

    beforeAll(() => {
        pathSnippetActionsMock = Mock.ofType(PathSnippetActions, MockBehavior.Strict);
        browserAdapterMock = Mock.ofType<BrowserAdapter>(undefined, MockBehavior.Strict);
        registerTypeToPayloadCallbackMock = Mock.ofInstance((_type, _callback) => {});

        testObject = new PathSnippetActionCreator(pathSnippetActionsMock.object, registerTypeToPayloadCallbackMock.object);
    });

    test('registerCallbacks for onAddPathForValidation', () => {
        const path = 'test path';
        const args = [path];
        const actionName = 'onAddPath';

        const builder = new ActionCreatorValidator()
            .setupRegistrationCallback(Messages.PathSnippet.AddPathForValidation, args)
            .setupActionsOnPathSnippetActions(actionName)
            .setupPathSnippetActionWithInvokeParameter(actionName, path);

        const actionCreator = builder.buildActionCreator();

        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('onGetInspectCurrentState', () => {
        const getCurrentStateMock = createActionMock(null);

        setupInspectActionMock('getCurrentState', getCurrentStateMock);

        setupRegisterTypeToPayloadCallbackMock(Messages.Inspect.GetCurrentState, null, tabId);

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

    function setupRegisterTypeToPayloadCallbackMock(message: string, payload: any, _tabId: number): void {
        registerTypeToPayloadCallbackMock
            .setup(registrar => registrar(message, It.is(_.isFunction)))
            .callback((_message, listener) => listener(payload, _tabId));
    }
});
