// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { assessmentsProviderForRequirements } from 'assessments/assessments-requirements-filter';
import { MediumPassRequirementMap } from 'assessments/medium-pass-requirements';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PermissionsStateStore } from 'background/stores/global/permissions-state-store';
import { FeatureFlagDefaultsHelper } from 'common/feature-flag-defaults-helper';
import { getAllFeatureFlagDetails } from 'common/feature-flags';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { BaseStore } from '../../../common/base-store';
import { BrowserAdapter } from '../../../common/browser-adapters/browser-adapter';
import { StorageAdapter } from '../../../common/browser-adapters/storage-adapter';
import { IndexedDBAPI } from '../../../common/indexedDB/indexedDB';
import { StoreType } from '../../../common/types/store-type';
import { generateUID } from '../../../common/uid-generator';
import { GlobalActionHub } from '../../actions/global-action-hub';
import { PersistedData } from '../../get-persisted-data';
import { LocalStorageData } from '../../storage-data';
import { TelemetryEventHandler } from '../../telemetry/telemetry-event-handler';
import { StoreHub } from '../store-hub';
import { AssessmentsProvider } from './../../../assessments/types/assessments-provider';
import { AssessmentDataConverter } from './../../assessment-data-converter';
import { AssessmentDataRemover } from './../../assessment-data-remover';
import { InitialAssessmentStoreDataGenerator } from './../../initial-assessment-store-data-generator';
import { AssessmentStore } from './../assessment-store';
import { CommandStore } from './command-store';
import { FeatureFlagStore } from './feature-flag-store';
import { LaunchPanelStore } from './launch-panel-store';
import { ScopingStore } from './scoping-store';
import { UserConfigurationStore } from './user-configuration-store';

export class GlobalStoreHub implements StoreHub {
    public commandStore: CommandStore;
    public featureFlagStore: FeatureFlagStore;
    public launchPanelStore: LaunchPanelStore;
    public scopingStore: ScopingStore;
    public assessmentStore: AssessmentStore;
    public quickAssessStore: AssessmentStore;
    public userConfigurationStore: UserConfigurationStore;
    public permissionsStateStore: PermissionsStateStore;

    constructor(
        globalActionHub: GlobalActionHub,
        telemetryEventHandler: TelemetryEventHandler,
        browserAdapter: BrowserAdapter,
        userData: LocalStorageData,
        assessmentsProvider: AssessmentsProvider,
        indexedDbInstance: IndexedDBAPI,
        persistedData: PersistedData,
        storageAdapter: StorageAdapter,
        logger: Logger,
    ) {
        this.commandStore = new CommandStore(
            globalActionHub.commandActions,
            telemetryEventHandler,
            persistedData.commandStoreData,
            indexedDbInstance,
            logger,
        );
        this.featureFlagStore = new FeatureFlagStore(
            globalActionHub.featureFlagActions,
            storageAdapter,
            userData,
            new FeatureFlagDefaultsHelper(getAllFeatureFlagDetails),
        );
        this.launchPanelStore = new LaunchPanelStore(
            globalActionHub.launchPanelStateActions,
            storageAdapter,
            userData,
        );
        this.scopingStore = new ScopingStore(
            globalActionHub.scopingActions,
            persistedData.scopingStoreData,
            indexedDbInstance,
            logger,
        );
        this.assessmentStore = new AssessmentStore(
            browserAdapter,
            globalActionHub.assessmentActions,
            new AssessmentDataConverter(generateUID),
            new AssessmentDataRemover(),
            assessmentsProvider,
            indexedDbInstance,
            persistedData.assessmentStoreData,
            new InitialAssessmentStoreDataGenerator(assessmentsProvider.all()),
            logger,
            StoreNames.AssessmentStore,
            IndexedDBDataKeys.assessmentStore,
        );
        const mediumPassProvider = assessmentsProviderForRequirements(
            assessmentsProvider,
            MediumPassRequirementMap,
        );
        this.quickAssessStore = new AssessmentStore(
            browserAdapter,
            globalActionHub.quickAssessActions,
            new AssessmentDataConverter(generateUID),
            new AssessmentDataRemover(),
            mediumPassProvider,
            indexedDbInstance,
            persistedData.quickAssessStoreData,
            new InitialAssessmentStoreDataGenerator(mediumPassProvider.all()),
            logger,
            StoreNames.QuickAssessStore,
            IndexedDBDataKeys.quickAssessStore,
        );
        this.userConfigurationStore = new UserConfigurationStore(
            persistedData.userConfigurationData,
            globalActionHub.userConfigurationActions,
            indexedDbInstance,
            logger,
        );
        this.permissionsStateStore = new PermissionsStateStore(
            globalActionHub.permissionsStateActions,
            persistedData.permissionsStateStoreData,
            indexedDbInstance,
            logger,
        );
    }

    public initialize(): void {
        this.commandStore.initialize();
        this.featureFlagStore.initialize();
        this.launchPanelStore.initialize();
        this.scopingStore.initialize();
        this.assessmentStore.initialize();
        this.quickAssessStore.initialize();
        this.userConfigurationStore.initialize();
        this.permissionsStateStore.initialize();
    }

    public getAllStores(): BaseStore<any, Promise<void>>[] {
        return [
            this.commandStore,
            this.featureFlagStore,
            this.launchPanelStore,
            this.scopingStore,
            this.assessmentStore,
            this.quickAssessStore,
            this.userConfigurationStore,
            this.permissionsStateStore,
        ];
    }

    public getStoreType(): StoreType {
        return StoreType.GlobalStore;
    }
}
