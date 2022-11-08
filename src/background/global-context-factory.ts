// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserPermissionsTracker } from 'background/browser-permissions-tracker';
import { Logger } from 'common/logging/logger';
import { DebugToolsActionCreator } from 'debug-tools/action-creators/debug-tools-action-creator';
import { DebugToolsController } from 'debug-tools/controllers/debug-tools-controller';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { CommandsAdapter } from '../common/browser-adapters/commands-adapter';
import { StorageAdapter } from '../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { StateDispatcher } from '../common/state-dispatcher';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { IssueFilingControllerImpl } from '../issue-filing/common/issue-filing-controller-impl';
import { IssueFilingServiceProvider } from '../issue-filing/issue-filing-service-provider';
import { AssessmentsProvider } from './../assessments/types/assessments-provider';
import { AssessmentActionCreator } from './actions/assessment-action-creator';
import { GlobalActionHub } from './actions/global-action-hub';
import { BrowserMessageBroadcasterFactory } from './browser-message-broadcaster-factory';
import { CompletedTestStepTelemetryCreator } from './completed-test-step-telemetry-creator';
import { FeatureFlagsController } from './feature-flags-controller';
import { PersistedData } from './get-persisted-data';
import { FeatureFlagsActionCreator } from './global-action-creators/feature-flags-action-creator';
import { GlobalActionCreator } from './global-action-creators/global-action-creator';
import { IssueFilingActionCreator } from './global-action-creators/issue-filing-action-creator';
import { PermissionsStateActionCreator } from './global-action-creators/permissions-state-action-creator';
import { registerUserConfigurationMessageCallback } from './global-action-creators/registrar/register-user-configuration-message-callbacks';
import { ScopingActionCreator } from './global-action-creators/scoping-action-creator';
import { UserConfigurationActionCreator } from './global-action-creators/user-configuration-action-creator';
import { GlobalContext } from './global-context';
import { Interpreter } from './interpreter';
import { LocalStorageData } from './storage-data';
import { GlobalStoreHub } from './stores/global/global-store-hub';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';
import { UserConfigurationController } from './user-configuration-controller';

export class GlobalContextFactory {
    public static async createContext(
        browserAdapter: BrowserAdapter,
        telemetryEventHandler: TelemetryEventHandler,
        userData: LocalStorageData,
        assessmentsProvider: AssessmentsProvider,
        telemetryDataFactory: TelemetryDataFactory,
        indexedDBInstance: IndexedDBAPI,
        persistedData: PersistedData,
        issueFilingServiceProvider: IssueFilingServiceProvider,
        storageAdapter: StorageAdapter,
        commandsAdapter: CommandsAdapter,
        logger: Logger,
    ): Promise<GlobalContext> {
        const interpreter = new Interpreter();

        const globalActionsHub = new GlobalActionHub();
        const globalStoreHub = new GlobalStoreHub(
            globalActionsHub,
            telemetryEventHandler,
            browserAdapter,
            userData,
            assessmentsProvider,
            indexedDBInstance,
            persistedData,
            storageAdapter,
            logger,
        );

        const featureFlagsController = new FeatureFlagsController(
            globalStoreHub.featureFlagStore,
            interpreter,
        );
        const userConfigurationController = new UserConfigurationController(interpreter);

        globalStoreHub.initialize();

        const issueFilingController = new IssueFilingControllerImpl(
            browserAdapter.createActiveTab,
            issueFilingServiceProvider,
            globalStoreHub.userConfigurationStore,
        );

        const scopingActionCreator = new ScopingActionCreator(
            interpreter,
            globalActionsHub.scopingActions,
        );
        const issueFilingActionCreator = new IssueFilingActionCreator(
            interpreter,
            telemetryEventHandler,
            issueFilingController,
        );
        const actionCreator = new GlobalActionCreator(
            globalActionsHub,
            interpreter,
            commandsAdapter,
            telemetryEventHandler,
        );
        const assessmentActionCreator = new AssessmentActionCreator(
            interpreter,
            globalActionsHub.assessmentActions,
            telemetryEventHandler,
        );
        const quickAssessActionCreator = new AssessmentActionCreator(
            interpreter,
            globalActionsHub.quickAssessActions,
            telemetryEventHandler,
        );
        const userConfigurationActionCreator = new UserConfigurationActionCreator(
            globalActionsHub.userConfigurationActions,
            telemetryEventHandler,
        );
        const featureFlagsActionCreator = new FeatureFlagsActionCreator(
            interpreter,
            globalActionsHub.featureFlagActions,
            telemetryEventHandler,
        );
        const permissionsStateActionCreator = new PermissionsStateActionCreator(
            interpreter,
            globalActionsHub.permissionsStateActions,
            telemetryEventHandler,
        );
        const debugToolsActionCreator = new DebugToolsActionCreator(
            interpreter,
            new DebugToolsController(browserAdapter),
        );

        issueFilingActionCreator.registerCallbacks();
        actionCreator.registerCallbacks();
        assessmentActionCreator.registerCallbacks();
        quickAssessActionCreator.registerCallbacks();
        registerUserConfigurationMessageCallback(interpreter, userConfigurationActionCreator);
        scopingActionCreator.registerCallback();
        featureFlagsActionCreator.registerCallbacks();
        permissionsStateActionCreator.registerCallbacks();
        debugToolsActionCreator.registerCallback();

        const messageBroadcasterFactory = new BrowserMessageBroadcasterFactory(
            browserAdapter,
            logger,
        );
        const dispatcher = new StateDispatcher(
            messageBroadcasterFactory.allTabsBroadcaster,
            globalStoreHub,
            logger,
        );
        await dispatcher.initialize();

        const assessmentChangeHandler = new CompletedTestStepTelemetryCreator(
            globalStoreHub.assessmentStore,
            assessmentsProvider,
            telemetryDataFactory,
            interpreter,
        );
        assessmentChangeHandler.initialize();

        const browserPermissionTracker = new BrowserPermissionsTracker(
            browserAdapter,
            interpreter,
            logger,
        );
        await browserPermissionTracker.initialize();

        return new GlobalContext(
            interpreter,
            globalStoreHub,
            featureFlagsController,
            userConfigurationController,
        );
    }
}
