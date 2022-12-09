// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionActions } from 'background/actions/injection-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { InitialVisualizationStoreDataGenerator } from 'background/initial-visualization-store-data-generator';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { DisplayableStrings } from 'common/constants/displayable-strings';
import { EnumHelper } from 'common/enum-helper';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { NotificationCreator } from 'common/notification-creator';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import {
    AssessmentScanData,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AssessmentToggleActionPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateSelectedPivot,
} from '../actions/action-payloads';
import { TabActions } from '../actions/tab-actions';
import { VisualizationActions } from '../actions/visualization-actions';

export class VisualizationStore extends PersistentStore<VisualizationStoreData> {
    private visualizationActions: VisualizationActions;
    private tabActions: TabActions;
    private injectionActions: InjectionActions;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;
    private initialVisualizationStoreDataGenerator: InitialVisualizationStoreDataGenerator;

    constructor(
        visualizationActions: VisualizationActions,
        tabActions: TabActions,
        injectionActions: InjectionActions,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
        persistedState: VisualizationStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
        private notificationCreator: NotificationCreator,
        initialVisualizationStoreDataGenerator: InitialVisualizationStoreDataGenerator,
    ) {
        super(
            StoreNames.VisualizationStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.visualizationStore(tabId),
            logger,
            persistStoreData,
        );

        this.visualizationActions = visualizationActions;
        this.tabActions = tabActions;
        this.injectionActions = injectionActions;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
        this.initialVisualizationStoreDataGenerator = initialVisualizationStoreDataGenerator;
    }

    protected addActionListeners(): void {
        this.visualizationActions.enableVisualization.addListener(this.onEnableVisualization);
        this.visualizationActions.enableVisualizationWithoutScan.addListener(
            this.onEnableVisualizationWithoutScan,
        );
        this.visualizationActions.disableVisualization.addListener(this.onDisableVisualization);
        this.visualizationActions.disableAssessmentVisualizations.addListener(
            this.onDisableAssessmentVisualizations,
        );

        this.visualizationActions.scanCompleted.addListener(this.onScanCompleted);
        this.visualizationActions.updateFocusedInstance.addListener(this.onUpdateFocusedInstance);
        this.visualizationActions.scrollRequested.addListener(this.onScrollRequested);

        this.visualizationActions.getCurrentState.addListener(this.onGetCurrentState);
        this.tabActions.existingTabUpdated.addListener(this.onExistingTabUpdated);

        this.visualizationActions.updateSelectedPivotChild.addListener(
            this.onUpdateSelectedPivotChild,
        );
        this.visualizationActions.updateSelectedPivot.addListener(this.onUpdateSelectedPivot);

        this.injectionActions.injectionCompleted.addListener(this.onInjectionCompleted);
        this.injectionActions.injectionStarted.addListener(this.onInjectionStarted);
        this.injectionActions.injectionFailed.addListener(this.onInjectionFailed);
    }

    protected generateDefaultState(persistedData: VisualizationStoreData): VisualizationStoreData {
        return this.initialVisualizationStoreDataGenerator.generateInitialState(persistedData);
    }

    public getDefaultState(): VisualizationStoreData {
        return this.generateDefaultState(this.persistedState);
    }

    private onDisableVisualization = async (test: VisualizationType): Promise<void> => {
        if (this.toggleTestOff(test)) {
            await this.emitChanged();
        }
    };

    private toggleTestOff(test: VisualizationType): boolean {
        let isStateChanged = false;
        if (this.state.scanning != null) {
            return isStateChanged;
        }

        const configuration = this.visualizationConfigurationFactory.getConfiguration(test);
        const scanData = configuration.getStoreData(this.state.tests);

        if (!this.isAdhoc(configuration)) {
            const assessmentScanData = configuration.getStoreData(
                this.state.tests,
            ) as AssessmentScanData;
            Object.keys(assessmentScanData.stepStatus).forEach(step => {
                if (assessmentScanData.enabled) {
                    configuration.disableTest(assessmentScanData, step);
                    isStateChanged = true;
                }
            });
            isStateChanged = true;
        } else {
            if (scanData.enabled) {
                configuration.disableTest(scanData);
                isStateChanged = true;
            }
        }

        return isStateChanged;
    }

    private onExistingTabUpdated = async (): Promise<void> => {
        this.state = {
            ...this.getDefaultState(),
            selectedFastPassDetailsView: this.state.selectedFastPassDetailsView,
            selectedAdhocDetailsView: this.state.selectedAdhocDetailsView,
            selectedDetailsViewPivot: this.state.selectedDetailsViewPivot,
        };
        await this.emitChanged();
    };

    private disableAssessmentVisualizationsWithoutEmitting(): void {
        EnumHelper.getNumericValues(VisualizationType).forEach((test: number) => {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(test);
            const shouldDisableTest = !this.isAdhoc(configuration);
            if (shouldDisableTest) {
                this.toggleTestOff(test);
            }
        });
    }

    private onDisableAssessmentVisualizations = async (): Promise<void> => {
        this.disableAssessmentVisualizationsWithoutEmitting();
        await this.emitChanged();
    };

    private onEnableVisualization = async (payload: ToggleActionPayload): Promise<void> => {
        await this.enableTest(payload, false);
    };

    private onEnableVisualizationWithoutScan = async (
        payload: ToggleActionPayload,
    ): Promise<void> => {
        await this.enableTest(payload, true);
    };

    private async enableTest(payload: ToggleActionPayload, skipScanning: boolean): Promise<void> {
        if (this.state.scanning != null) {
            // do not change state if currently scanning, not even the toggle
            return;
        }

        const configuration = this.visualizationConfigurationFactory.getConfiguration(payload.test);
        this.disableAssessmentVisualizationsWithoutEmitting();

        const step = (payload as AssessmentToggleActionPayload).requirement;
        if (!skipScanning) {
            this.state.scanning = configuration.getIdentifier(step);
        }

        this.state.injectingRequested = true;
        configuration.enableTest(configuration.getStoreData(this.state.tests), payload);
        await this.emitChanged();
    }

    private isAdhoc(config: VisualizationConfiguration): boolean {
        return config.testMode === TestMode.Adhoc;
    }

    private onUpdateSelectedPivot = async (payload: UpdateSelectedPivot): Promise<void> => {
        const pivot = payload.pivotKey;

        if (this.state.selectedDetailsViewPivot !== pivot) {
            this.state.selectedDetailsViewPivot = pivot;
            this.disableAllTests();
            await this.emitChanged();
        }
    };

    private disableAllTests(): void {
        EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
            this.toggleTestOff(test);
        });
    }

    private onUpdateSelectedPivotChild = async (
        payload: UpdateSelectedDetailsViewPayload,
    ): Promise<void> => {
        const pivot = payload.pivotType;
        const pivotChildUpdated = this.updateSelectedPivotChildUnderPivot(payload);
        const pivotUpdated = this.updateSelectedPivot(pivot);
        if (pivotChildUpdated || pivotUpdated) {
            this.disableAllTests();
            await this.emitChanged();
        }
    };

    private onScanCompleted = async (): Promise<void> => {
        this.state.scanning = null;
        await this.emitChanged();
    };

    private onScrollRequested = async (): Promise<void> => {
        this.state.focusedTarget = null;
        await this.emitChanged();
    };

    private onUpdateFocusedInstance = async (focusedInstanceTarget: string[]): Promise<void> => {
        this.state.focusedTarget = focusedInstanceTarget;
        await this.emitChanged();
    };

    private onInjectionCompleted = async (): Promise<void> => {
        this.state.injectingRequested = false;
        this.state.injectingStarted = false;
        await this.emitChanged();
    };

    private onInjectionStarted = async (): Promise<void> => {
        if (this.state.injectingStarted) {
            return;
        }

        this.state.injectingRequested = true;
        this.state.injectingStarted = true;
        await this.emitChanged();
    };

    private onInjectionFailed = async (): Promise<void> => {
        this.state.injectionAttempts = (this.state.injectionAttempts ?? 0) + 1;
        if (this.state.injectionAttempts < 3) {
            this.state.injectingRequested = true;
            this.state.injectingStarted = false;
        } else {
            this.state.injectionFailed = true;
            this.notificationCreator.createNotification(DisplayableStrings.injectionFailed);
        }
        await this.emitChanged();
    };

    private updateSelectedPivotChildUnderPivot(payload: UpdateSelectedDetailsViewPayload): boolean {
        if (payload.detailsViewType == null) {
            return false;
        }

        let updated = false;

        if (
            this.state.selectedFastPassDetailsView !== payload.detailsViewType &&
            payload.pivotType === DetailsViewPivotType.fastPass
        ) {
            this.state.selectedFastPassDetailsView = payload.detailsViewType;
            updated = true;
        }

        return updated;
    }

    private updateSelectedPivot(pivot: DetailsViewPivotType): boolean {
        let updated = false;
        if (pivot != null && this.state.selectedDetailsViewPivot !== pivot) {
            this.state.selectedDetailsViewPivot = pivot;
            updated = true;
        }

        return updated;
    }
}
