// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    OnDetailsViewInitializedPayload,
    SetLaunchPanelState,
} from 'background/actions/action-payloads';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { CommandActions } from 'background/actions/command-actions';
import { FeatureFlagActions } from 'background/actions/feature-flag-actions';
import { GlobalActionHub } from 'background/actions/global-action-hub';
import { LaunchPanelStateActions } from 'background/actions/launch-panel-state-action';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { UserConfigurationActions } from 'background/actions/user-configuration-actions';
import { GlobalActionCreator } from 'background/global-action-creators/global-action-creator';
import { Interpreter } from 'background/interpreter';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Action } from 'common/flux/action';
import { PayloadCallback } from 'common/message';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { CommandsAdapter } from '../../../../../common/browser-adapters/commands-adapter';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';
import { DictionaryStringTo } from '../../../../../types/common-types';

describe('GlobalActionCreatorTest', () => {
    test('onGetCommands', async () => {
        const tabId = 100;
        const commands: chrome.commands.Command[] = [
            {
                name: 'test command',
            },
        ];
        const getCommandStoreState = getStoreStateMessage(StoreNames.CommandStore);
        const payload = {
            type: getCommandStoreState,
            tabId: tabId,
        };
        const invokeParameter = {
            commands: commands,
            tabId: tabId,
        };

        const actionName = 'getCommands';
        const builder = new GlobalActionCreatorValidator()
            .setupGetCommandsFromAdapter(commands)
            .setupRegisterCallbacks()
            .setupCommandActionWithInvokeParameter(actionName, invokeParameter)
            .setupActionOnCommandActions(actionName);

        const actionCreator = builder.buildActionCreator();
        actionCreator.registerCallbacks();

        await builder.simulateMessage(getCommandStoreState, payload, tabId);

        builder.verifyAll();
    });

    test('registerCallback for on get launch panel state', async () => {
        const actionName = 'getCurrentState';
        const validator = new GlobalActionCreatorValidator()
            .setupRegisterCallbacks()
            .setupActionOnLaunchPanelActions(actionName)
            .setupLaunchPanelActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(getStoreStateMessage(StoreNames.LaunchPanelStateStore));

        validator.verifyAll();
    });

    test('registerCallback for on set launch panel state', async () => {
        const actionName = 'setLaunchPanelType';
        const payload: SetLaunchPanelState = {
            launchPanelType: LaunchPanelType.AdhocToolsPanel,
        };

        const validator = new GlobalActionCreatorValidator()
            .setupRegisterCallbacks()
            .setupActionOnLaunchPanelActions(actionName)
            .setupLaunchPanelActionWithInvokeParameter(actionName, payload.launchPanelType);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(Messages.LaunchPanel.Set, payload);

        validator.verifyAll();
    });

    test('registerCallback for on onSendTelemetry', async () => {
        const payload = { eventName: 'launch-panel/open', telemetry: {} };
        const validator = new GlobalActionCreatorValidator()
            .setupRegisterCallbacks()
            .setupTelemetrySend('launch-panel/open');

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(Messages.Telemetry.Send, payload, 1);

        validator.verifyAll();
    });

    test('handles DetailsViewInitialize message', async () => {
        const actionName = 'updateDetailsViewId';
        const payload: OnDetailsViewInitializedPayload = {
            detailsViewId: 'testId',
        } as OnDetailsViewInitializedPayload;

        const validator = new GlobalActionCreatorValidator()
            .setupRegisterCallbacks()
            .setupActionOnAssessmentActions(actionName)
            .setupActionOnQuickAssessActions(actionName)
            .setupAssessmentActionWithInvokeParameter(actionName, payload)
            .setupQuickAssessActionWithInvokeParameter(actionName, payload);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        await validator.simulateMessage(Messages.Visualizations.DetailsView.Initialize, payload);

        validator.verifyAll();
    });
});

class GlobalActionCreatorValidator {
    public testSubject: GlobalActionCreator;
    private commandActionMocksMap: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private featureFlagActionsMockMap: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private launchPanelActionsMockMap: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private assessmentActionsMockMap: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private quickAssessActionsMockMap: DictionaryStringTo<IMock<Action<any, any>>> = {};
    private registeredCallbacksMap: DictionaryStringTo<PayloadCallback<any>> = {};

    private commandActionsContainerMock = Mock.ofType(CommandActions);
    private featureFlagActionsContainerMock = Mock.ofType(FeatureFlagActions);
    private launchPanelStateActionsContainerMock = Mock.ofType(LaunchPanelStateActions);
    private assessmentActionsContainerMock = Mock.ofType(AssessmentActions);
    private quickAssessActionsContainerMock = Mock.ofType(AssessmentActions);
    private userConfigActionsContainerMock = Mock.ofType(UserConfigurationActions);
    private permissionsStateActionsContainerMock = Mock.ofType(PermissionsStateActions);
    private interpreterMock = Mock.ofType<Interpreter>();
    private commandsAdapterMock = Mock.ofType<CommandsAdapter>();

    private telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);

    private globalActionHubMock: GlobalActionHub = {
        commandActions: this.commandActionsContainerMock.object,
        featureFlagActions: this.featureFlagActionsContainerMock.object,
        launchPanelStateActions: this.launchPanelStateActionsContainerMock.object,
        scopingActions: null,
        assessmentActions: this.assessmentActionsContainerMock.object,
        quickAssessActions: this.quickAssessActionsContainerMock.object,
        userConfigurationActions: this.userConfigActionsContainerMock.object,
        permissionsStateActions: this.permissionsStateActionsContainerMock.object,
    };

    private actionsSetup: boolean = false;

    public setupActionOnCommandActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(
            actionName,
            this.commandActionsContainerMock,
            this.commandActionMocksMap,
        );
    }

    public setupActionOnFeatureFlagActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(
            actionName,
            this.featureFlagActionsContainerMock,
            this.featureFlagActionsMockMap,
        );
    }

    public setupActionOnLaunchPanelActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(
            actionName,
            this.launchPanelStateActionsContainerMock,
            this.launchPanelActionsMockMap,
        );
    }

    public setupActionOnAssessmentActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(
            actionName,
            this.assessmentActionsContainerMock,
            this.assessmentActionsMockMap,
        );
    }

    public setupActionOnQuickAssessActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(
            actionName,
            this.quickAssessActionsContainerMock,
            this.quickAssessActionsMockMap,
        );
    }

    public setupGetCommandsFromAdapter(
        commands: chrome.commands.Command[],
    ): GlobalActionCreatorValidator {
        this.commandsAdapterMock.setup(x => x.getCommands()).returns(async () => commands);

        return this;
    }

    public setupCommandActionWithInvokeParameter(
        actionName: keyof CommandActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.commandActionMocksMap,
        );
    }

    public setupFeatureFlagActionWithInvokeParameter(
        actionName: keyof FeatureFlagActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.featureFlagActionsMockMap,
        );
    }

    public setupLaunchPanelActionWithInvokeParameter(
        actionName: keyof LaunchPanelStateActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.launchPanelActionsMockMap,
        );
    }

    public setupAssessmentActionWithInvokeParameter(
        actionName: keyof AssessmentActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.assessmentActionsMockMap,
        );
    }

    public setupQuickAssessActionWithInvokeParameter(
        actionName: keyof AssessmentActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(
            actionName,
            expectedInvokeParam,
            this.quickAssessActionsMockMap,
        );
    }

    private setupActionWithInvokeParameter(
        actionName: string,
        expectedInvokeParam: any,
        actionsMockMap: DictionaryStringTo<IMock<Action<unknown, void | Promise<void>>>>,
    ): GlobalActionCreatorValidator {
        const action = this.getOrCreateAction(actionName, actionsMockMap);

        action.setup(am => am.invoke(It.isValue(expectedInvokeParam))).verifiable(Times.once());

        return this;
    }

    private getOrCreateAction(
        actionName: string,
        actionsMockMap: DictionaryStringTo<IMock<Action<unknown, void | Promise<void>>>>,
    ): IMock<Action<unknown, void | Promise<void>>> {
        let action = actionsMockMap[actionName];

        if (action == null) {
            action = Mock.ofType<Action<unknown, void | Promise<void>>>();
            actionsMockMap[actionName] = action;
        }
        return action;
    }

    private setupAction(
        actionName: string,
        actionsContainerMock: IMock<any>,
        actionsMockMap: DictionaryStringTo<IMock<Action<unknown, void | Promise<void>>>>,
    ): GlobalActionCreatorValidator {
        const action = this.getOrCreateAction(actionName, actionsMockMap);

        actionsContainerMock
            .setup(vam => vam[actionName])
            .returns(() => action.object)
            .verifiable(Times.once());

        this.actionsSetup = true;
        return this;
    }

    public setupRegisterCallbacks(): GlobalActionCreatorValidator {
        this.interpreterMock
            .setup(x => x.registerTypeToPayloadCallback(It.isAny(), It.isAny()))
            .callback(async (messageType, callback: PayloadCallback<any>) => {
                this.registeredCallbacksMap[messageType] = callback;
            });

        return this;
    }

    public async simulateMessage(
        messageType: string,
        payload?: any,
        tabId?: number,
    ): Promise<void> {
        const callback = this.registeredCallbacksMap[messageType];
        expect(callback).toBeDefined();

        await callback(payload, tabId);
    }

    public setupTelemetrySend(eventName: string): GlobalActionCreatorValidator {
        this.telemetryEventHandlerMock
            .setup(tsm => tsm.publishTelemetry(It.isValue(eventName), It.isAny()))
            .verifiable(Times.once());

        return this;
    }

    public buildActionCreator(): GlobalActionCreator {
        const testSubject = new GlobalActionCreator(
            this.globalActionHubMock,
            this.interpreterMock.object,
            this.commandsAdapterMock.object,
            this.telemetryEventHandlerMock.object,
        );
        this.testSubject = testSubject;
        return testSubject;
    }

    public verifyAll(): void {
        if (this.actionsSetup) {
            this.verifyAllActionMocks();
        }

        this.interpreterMock.verifyAll();
        this.telemetryEventHandlerMock.verifyAll();
    }

    private verifyAllActionMocks(): void {
        this.verifyAllActions(this.commandActionMocksMap);
        this.verifyAllActions(this.featureFlagActionsMockMap);
        this.verifyAllActions(this.launchPanelActionsMockMap);
        this.verifyAllActions(this.assessmentActionsMockMap);
        this.verifyAllActions(this.quickAssessActionsMockMap);
    }

    private verifyAllActions(
        actionsMap: DictionaryStringTo<IMock<Action<unknown, void | Promise<void>>>>,
    ): void {
        for (const actionName in actionsMap) {
            if (actionsMap.hasOwnProperty(actionName)) {
                actionsMap[actionName].verifyAll();
            }
        }
    }
}
