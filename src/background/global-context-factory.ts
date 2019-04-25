// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBAPI } from '../common/indexedDB/indexedDB';
import { StateDispatcher } from '../common/state-dispatcher';
import { TelemetryDataFactory } from '../common/telemetry-data-factory';
import { AssessmentsProvider } from './../assessments/types/assessments-provider';
import { AssessmentActionCreator } from './actions/assessment-action-creator';
import { GlobalActionCreator } from './actions/global-action-creator';
import { GlobalActionHub } from './actions/global-action-hub';
import { BrowserAdapter } from './browser-adapter';
import { CompletedTestStepTelemetryCreator } from './completed-test-step-telemetry-creator';
import { FeatureFlagsController } from './feature-flags-controller';
import { PersistedData } from './get-persisted-data';
import { GlobalContext } from './global-context';
import { Interpreter } from './interpreter';
import { LocalStorageData } from './storage-data';
import { GlobalStoreHub } from './stores/global/global-store-hub';
import { TelemetryEventHandler } from './telemetry/telemetry-event-handler';
import { IssueFilingControllerImpl } from '../bug-filing/common/issue-filing-controller-impl';
import { IssueFilingActionCreator } from './global-action-creators/issue-filing-action-creator';
import { BugFilingServiceProvider } from '../bug-filing/bug-filing-service-provider';
import { EnvironmentInfo } from '../common/environment-info-provider';

export class GlobalContextFactory {
    public static createContext(
        browserAdapter: BrowserAdapter,
        telemetryEventHandler: TelemetryEventHandler,
        userData: LocalStorageData,
        assessmentsProvider: AssessmentsProvider,
        telemetryDataFactory: TelemetryDataFactory,
        indexedDBInstance: IndexedDBAPI,
        persistedData: PersistedData,
        issueFilingServiceProvider?: BugFilingServiceProvider,
        environmentInfo?: EnvironmentInfo,
    ): GlobalContext {
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
        );

        const featureFlagsController = new FeatureFlagsController(globalStoreHub.featureFlagStore, interpreter);

        globalStoreHub.initialize();

        const issueFilingController = new IssueFilingControllerImpl(
            issueFilingServiceProvider,
            browserAdapter,
            environmentInfo,
            globalStoreHub.userConfigurationStore,
        );

        const issueFilingActionCreator = new IssueFilingActionCreator(interpreter, telemetryEventHandler, issueFilingController);
        const actionCreator = new GlobalActionCreator(globalActionsHub, interpreter, browserAdapter, telemetryEventHandler);
        const assessmentActionCreator = new AssessmentActionCreator(
            globalActionsHub.assessmentActions,
            telemetryEventHandler,
            interpreter.registerTypeToPayloadCallback,
        );

        issueFilingActionCreator.registerCallbacks();
        actionCreator.registerCallbacks();
        assessmentActionCreator.registerCallbacks();

        const dispatcher = new StateDispatcher(browserAdapter.sendMessageToAllFramesAndTabs, globalStoreHub);
        dispatcher.initialize();

        const assessmentChangeHandler = new CompletedTestStepTelemetryCreator(
            globalStoreHub.assessmentStore,
            assessmentsProvider,
            telemetryDataFactory,
            interpreter,
        );
        assessmentChangeHandler.initialize();

        return new GlobalContext(interpreter, globalStoreHub, featureFlagsController);
    }
}
