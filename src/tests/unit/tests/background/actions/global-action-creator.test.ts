// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { SetLaunchPanelState } from '../../../../../background/actions/action-payloads';
import { AssessmentActions } from '../../../../../background/actions/assessment-actions';
import { CommandActions } from '../../../../../background/actions/command-actions';
import { FeatureFlagActions, FeatureFlagPayload } from '../../../../../background/actions/feature-flag-actions';
import { GlobalActionCreator } from '../../../../../background/actions/global-action-creator';
import { GlobalActionHub } from '../../../../../background/actions/global-action-hub';
import { LaunchPanelStateActions } from '../../../../../background/actions/launch-panel-state-action';
import { IScopingPayload, ScopingActions } from '../../../../../background/actions/scoping-actions';
import { UserConfigurationActions } from '../../../../../background/actions/user-configuration-actions';
import { ChromeAdapter } from '../../../../../background/browser-adapter';
import { TelemetryEventHandler } from '../../../../../background/telemetry/telemetry-event-handler';
import { Action } from '../../../../../common/flux/action';
import { Messages } from '../../../../../common/messages';
import * as TelemetryEvents from '../../../../../common/telemetry-events';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { LaunchPanelType } from '../../../../../popup/scripts/components/popup-view';
import { InterpreterStub } from '../../../stubs/interpreter-stub';

describe('GlobalActionCreatorTest', () => {
    test('onGetCommands', () => {
        const tabId = 100;
        const commands: chrome.commands.Command[] = [
            {
                name: 'test command',
            },
        ];
        const payload = {
            type: Messages.Command.GetCommands,
            tabId: tabId,
        };
        const invokeParameter = {
            commands: commands,
            tabId: tabId,
        };

        const actionName = 'getCommands';
        const args = [payload, tabId];
        const builder = new GlobalActionCreatorValidator()
            .setupGetCommandsFromBrowser(commands)
            .setupRegistrationCallback(Messages.Command.GetCommands, args)
            .setupCommandActionWithInvokeParameter(actionName, invokeParameter)
            .setupActionOnCommandActions(actionName);

        const actionCreator = builder.buildActionCreator();
        actionCreator.registerCallbacks();

        builder.verifyAll();
    });

    test('registerCallback for FeatureFlags.GetFeatureFlags', () => {
        const actionName = 'getCurrentState';
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.FeatureFlags.GetFeatureFlags)
            .setupActionOnFeatureFlagActions(actionName)
            .setupFeatureFlagActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for FeatureFlags.SetFeatureFlag', () => {
        const featureFlagActionName = 'setFeatureFlag';
        const userConfigActionName = 'notifyFeatureFlagChange';
        const payload: FeatureFlagPayload = {
            feature: 'registerCallback test feature',
            enabled: true,
        };
        const args = [payload];

        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.FeatureFlags.SetFeatureFlag, args)
            .setupActionOnFeatureFlagActions(featureFlagActionName)
            .setupActionsOnUserConfig(userConfigActionName)
            .setupFeatureFlagActionWithInvokeParameter(featureFlagActionName, payload)
            .setupUserConfigActionWithInvokeParameter(userConfigActionName, payload)
            .setupTelemetrySend(TelemetryEvents.PREVIEW_FEATURES_TOGGLE);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for FeatureFlags.ResetFeatureFlag', () => {
        const actionName = 'resetFeatureFlags';
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.FeatureFlags.ResetFeatureFlag)
            .setupActionOnFeatureFlagActions(actionName)
            .setupFeatureFlagActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on get launch panel state', () => {
        const actionName = 'getCurrentState';
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.LaunchPanel.Get)
            .setupActionOnLaunchPanelActions(actionName)
            .setupLaunchPanelActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on set launch panel state', () => {
        const actionName = 'setLaunchPanelType';
        const payload: SetLaunchPanelState = {
            launchPanelType: LaunchPanelType.AdhocToolsPanel,
        };
        const args = [payload];

        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.LaunchPanel.Set, args)
            .setupActionOnLaunchPanelActions(actionName)
            .setupLaunchPanelActionWithInvokeParameter(actionName, payload.launchPanelType);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on onGetScopingState', () => {
        const actionName = 'getCurrentState';
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.Scoping.GetCurrentState)
            .setupActionsOnScoping(actionName)
            .setupScopingActionWithInvokeParameter(actionName, null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onAddSelector', () => {
        const actionName = 'addSelector';
        const payload: IScopingPayload = {
            inputType: 'generic',
            selector: ['iframe', 'selector'],
        };

        const args = [payload];

        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.Scoping.AddSelector, args)
            .setupActionsOnScoping(actionName)
            .setupScopingActionWithInvokeParameter(actionName, payload);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for onDeleteSelector', () => {
        const actionName = 'deleteSelector';
        const payload: IScopingPayload = {
            inputType: 'generic',
            selector: ['iframe', 'selector'],
        };

        const args = [payload];

        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.Scoping.DeleteSelector, args)
            .setupActionsOnScoping(actionName)
            .setupScopingActionWithInvokeParameter(actionName, payload);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on onSendTelemetry', () => {
        const payload = { eventName: 'launch-panel/open', telemetry: {} };
        const args = [payload, 1];
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.Telemetry.Send, args)
            .setupTelemetrySend('launch-panel/open');

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on UserConfig.GetCurrentState', () => {
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.UserConfig.GetCurrentState)
            .setupActionsOnUserConfig('getCurrentState')
            .setupUserConfigActionWithInvokeParameter('getCurrentState', null);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on UserConfig.SetTelemetryConfig', () => {
        const payload: UserConfigurationStoreData = {
            enableTelemetry: true,
            isFirstTime: false,
            enableHighContrast: false,
        };
        const args = [payload];
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.UserConfig.SetTelemetryConfig, args)
            .setupActionsOnUserConfig('setTelemetryState')
            .setupUserConfigActionWithInvokeParameter('setTelemetryState', payload);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });

    test('registerCallback for on UserConfig.SetHighContrastConfig', () => {
        const payload: UserConfigurationStoreData = {
            enableTelemetry: true,
            isFirstTime: false,
            enableHighContrast: true,
        };
        const args = [payload];
        const validator = new GlobalActionCreatorValidator()
            .setupRegistrationCallback(Messages.UserConfig.SetHighContrastConfig, args)
            .setupActionsOnUserConfig('setHighContrastMode')
            .setupUserConfigActionWithInvokeParameter('setHighContrastMode', payload);

        const actionCreator = validator.buildActionCreator();
        actionCreator.registerCallbacks();

        validator.verifyAll();
    });
});

// tslint:disable-next-line:max-classes-per-file
class GlobalActionCreatorValidator {
    public testSubject: GlobalActionCreator;
    private commandActionMocksMap: IDictionaryStringTo<IMock<Action<any>>> = {};
    private featureFlagActionsMockMap: IDictionaryStringTo<IMock<Action<any>>> = {};
    private launchPanelActionsMockMap: IDictionaryStringTo<IMock<Action<any>>> = {};
    private scopingActionsMockMap: IDictionaryStringTo<IMock<Action<any>>> = {};
    private userConfigMockMap: IDictionaryStringTo<IMock<Action<any>>> = {};

    private commandActionsContainerMock = Mock.ofType(CommandActions);
    private featureFlagActionsContainerMock = Mock.ofType(FeatureFlagActions);
    private launchPanelStateActionsContainerMock = Mock.ofType(LaunchPanelStateActions);
    private scopingActionsContainerMock = Mock.ofType(ScopingActions);
    private assessmentActionsContainerMock = Mock.ofType(AssessmentActions);
    private userConfigActionsContainerMock = Mock.ofType(UserConfigurationActions);
    private interpreterMock = Mock.ofType(InterpreterStub);
    private browserAdapterMock = Mock.ofType(ChromeAdapter, MockBehavior.Strict);
    private telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler, MockBehavior.Strict);

    private globalActionHubMock: GlobalActionHub = {
        commandActions: this.commandActionsContainerMock.object,
        featureFlagActions: this.featureFlagActionsContainerMock.object,
        launchPanelStateActions: this.launchPanelStateActionsContainerMock.object,
        scopingActions: this.scopingActionsContainerMock.object,
        assessmentActions: this.assessmentActionsContainerMock.object,
        userConfigurationActions: this.userConfigActionsContainerMock.object,
    };

    private actionsSetup: boolean = false;

    public setupActionOnCommandActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(actionName, this.commandActionsContainerMock, this.commandActionMocksMap);
    }

    public setupActionOnFeatureFlagActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(actionName, this.featureFlagActionsContainerMock, this.featureFlagActionsMockMap);
    }

    public setupActionOnLaunchPanelActions(actionName: string): GlobalActionCreatorValidator {
        return this.setupAction(actionName, this.launchPanelStateActionsContainerMock, this.launchPanelActionsMockMap);
    }

    public setupActionsOnScoping(actionName: keyof ScopingActions): GlobalActionCreatorValidator {
        return this.setupAction(actionName, this.scopingActionsContainerMock, this.scopingActionsMockMap);
    }

    public setupActionsOnUserConfig(actionName: keyof UserConfigurationActions): GlobalActionCreatorValidator {
        return this.setupAction(actionName, this.userConfigActionsContainerMock, this.userConfigMockMap);
    }

    public setupGetCommandsFromBrowser(commands: chrome.commands.Command[]): GlobalActionCreatorValidator {
        this.browserAdapterMock
            .setup(x => x.getCommands(It.isAny()))
            .callback(cb => {
                cb(commands);
            });

        return this;
    }

    public setupSetUserData(data: any): GlobalActionCreatorValidator {
        this.browserAdapterMock.setup(bam => bam.setUserData(It.isValue(data))).verifiable(Times.once());
        return this;
    }

    public setupCommandActionWithInvokeParameter(actionName: keyof CommandActions, expectedInvokeParam: any): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.commandActionMocksMap);
    }

    public setupFeatureFlagActionWithInvokeParameter(
        actionName: keyof FeatureFlagActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.featureFlagActionsMockMap);
    }

    public setupLaunchPanelActionWithInvokeParameter(
        actionName: keyof LaunchPanelStateActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.launchPanelActionsMockMap);
    }

    public setupScopingActionWithInvokeParameter(actionName: keyof ScopingActions, expectedInvokeParam: any): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.scopingActionsMockMap);
    }

    public setupUserConfigActionWithInvokeParameter(
        actionName: keyof UserConfigurationActions,
        expectedInvokeParam: any,
    ): GlobalActionCreatorValidator {
        return this.setupActionWithInvokeParameter(actionName, expectedInvokeParam, this.userConfigMockMap);
    }

    private setupActionWithInvokeParameter(
        actionName: string,
        expectedInvokeParam: any,
        actionsMockMap: IDictionaryStringTo<IMock<Action<any>>>,
    ): GlobalActionCreatorValidator {
        const action = this.getOrCreateAction(actionName, actionsMockMap);

        action.setup(am => am.invoke(It.isValue(expectedInvokeParam))).verifiable(Times.once());

        return this;
    }

    private getOrCreateAction(actionName: string, actionsMockMap: IDictionaryStringTo<IMock<Action<any>>>): IMock<Action<any>> {
        let action = actionsMockMap[actionName];

        if (action == null) {
            action = Mock.ofType(Action);
            actionsMockMap[actionName] = action;
        }
        return action;
    }

    private setupAction(
        actionName: string,
        actionsContainerMock: IMock<any>,
        actionsMapMock: IDictionaryStringTo<IMock<Action<any>>>,
    ): GlobalActionCreatorValidator {
        const action = this.getOrCreateAction(actionName, actionsMapMock);

        actionsContainerMock
            .setup(vam => vam[actionName])
            .returns(() => action.object)
            .verifiable(Times.once());

        this.actionsSetup = true;
        return this;
    }

    public setupRegistrationCallback(expectedType: string, callbackParams?: any[]): GlobalActionCreatorValidator {
        this.interpreterMock
            .setup(x => x.registerTypeToPayloadCallback(It.isValue(expectedType), It.isAny()))
            .callback((messageType, callback) => {
                if (callbackParams) {
                    callback.apply(null, callbackParams);
                } else {
                    callback();
                }
            });

        return this;
    }

    public setupTelemetrySend(eventName: string): GlobalActionCreatorValidator {
        this.telemetryEventHandlerMock.setup(tsm => tsm.publishTelemetry(It.isValue(eventName), It.isAny())).verifiable(Times.once());

        return this;
    }

    public buildActionCreator(): GlobalActionCreator {
        const testSubject = new GlobalActionCreator(
            this.globalActionHubMock,
            this.interpreterMock.object,
            this.browserAdapterMock.object,
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
        this.browserAdapterMock.verifyAll();
        this.telemetryEventHandlerMock.verifyAll();
    }

    private verifyAllActionMocks(): void {
        this.verifyAllActions(this.commandActionMocksMap);
        this.verifyAllActions(this.featureFlagActionsMockMap);
        this.verifyAllActions(this.launchPanelActionsMockMap);
        this.verifyAllActions(this.scopingActionsMockMap);
        this.verifyAllActions(this.userConfigMockMap);
    }

    private verifyAllActions(actionsMap: IDictionaryStringTo<IMock<Action<any>>>): void {
        for (const actionName in actionsMap) {
            if (actionsMap.hasOwnProperty(actionName)) {
                actionsMap[actionName].verifyAll();
            }
        }
    }
}
