// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionActions } from 'background/actions/injection-actions';
import { TestMode } from 'common/configs/test-mode';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { EnumHelper } from 'common/enum-helper';
import { Tab } from 'common/itab';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import {
    AssessmentScanData,
    TestsEnabledState,
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
import { BaseStoreImpl } from './base-store-impl';

export class VisualizationStore extends BaseStoreImpl<VisualizationStoreData> {
    private visualizationActions: VisualizationActions;
    private tabActions: TabActions;
    private injectionActions: InjectionActions;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;

    constructor(
        visualizationActions: VisualizationActions,
        tabActions: TabActions,
        injectionActions: InjectionActions,
        visualizationConfigurationFactory: VisualizationConfigurationFactory,
    ) {
        super(StoreNames.VisualizationStore);

        this.visualizationActions = visualizationActions;
        this.tabActions = tabActions;
        this.injectionActions = injectionActions;
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
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
    }

    public getDefaultState(): VisualizationStoreData {
        const tests: TestsEnabledState = {
            adhoc: {},
            assessments: {},
        };

        if (this.visualizationConfigurationFactory != null) {
            EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
                const config = this.visualizationConfigurationFactory.getConfiguration(test);
                tests[config.testMode][config.key] = {
                    enabled: false,
                };
            });

            Object.keys(tests.assessments).forEach(key => {
                tests.assessments[key].stepStatus = {};
            });
        }

        const defaultValues: VisualizationStoreData = {
            tests,
            scanning: null,
            selectedFastPassDetailsView: VisualizationType.Issues,
            selectedAdhocDetailsView: VisualizationType.Issues,
            selectedDetailsViewPivot: DetailsViewPivotType.fastPass,
            injectingStarted: false,
            injectingInProgress: null,
            focusedTarget: null,
        };

        return defaultValues;
    }

    private onDisableVisualization = (test: VisualizationType): void => {
        if (this.toggleTestOff(test)) {
            this.emitChanged();
        }
    };

    private toggleTestOff(test: VisualizationType): boolean {
        let isStateChanged = false;
        if (this.state.scanning != null) {
            return isStateChanged;
        }

        const configuration = this.visualizationConfigurationFactory.getConfiguration(test);
        const scanData = configuration.getStoreData(this.state.tests);

        if (this.isAssessment(configuration)) {
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

    private onExistingTabUpdated = (payload: Tab): void => {
        this.state = {
            ...this.getDefaultState(),
            selectedFastPassDetailsView: this.state.selectedFastPassDetailsView,
            selectedAdhocDetailsView: this.state.selectedAdhocDetailsView,
            selectedDetailsViewPivot: this.state.selectedDetailsViewPivot,
        };
        this.emitChanged();
    };

    private disableAssessmentVisualizationsWithoutEmitting(): void {
        EnumHelper.getNumericValues(VisualizationType).forEach((test: number) => {
            const configuration = this.visualizationConfigurationFactory.getConfiguration(test);
            const shouldDisableTest = this.isAssessment(configuration);
            if (shouldDisableTest) {
                this.toggleTestOff(test);
            }
        });
    }

    private onDisableAssessmentVisualizations = (): void => {
        this.disableAssessmentVisualizationsWithoutEmitting();
        this.emitChanged();
    };

    private onEnableVisualization = (payload: ToggleActionPayload): void => {
        this.enableTest(payload, false);
    };

    private onEnableVisualizationWithoutScan = (payload: ToggleActionPayload): void => {
        this.enableTest(payload, true);
    };

    private enableTest(payload: ToggleActionPayload, skipScanning: boolean): void {
        if (this.state.scanning != null) {
            // do not change state if currently scanning, not even the toggle
            return;
        }

        const configuration = this.visualizationConfigurationFactory.getConfiguration(payload.test);
        this.disableAssessmentVisualizationsWithoutEmitting();
        const scanData = configuration.getStoreData(this.state.tests);

        const step = (payload as AssessmentToggleActionPayload).requirement;
        const alreadyEnabled = configuration.getTestStatus(scanData, step);
        if (!alreadyEnabled) {
            if (!skipScanning) {
                this.state.scanning = configuration.getIdentifier(step);
            }

            this.state.injectingInProgress = true;
            configuration.enableTest(this.state.tests, payload);
        }
        this.emitChanged();
    }

    private isAssessment(config: VisualizationConfiguration): boolean {
        return config.testMode === TestMode.Assessments;
    }

    private onUpdateSelectedPivot = (payload: UpdateSelectedPivot): void => {
        const pivot = payload.pivotKey;

        if (this.state.selectedDetailsViewPivot !== pivot) {
            this.state.selectedDetailsViewPivot = pivot;
            this.disableAllTests();
            this.emitChanged();
        }
    };

    private disableAllTests(): void {
        EnumHelper.getNumericValues(VisualizationType).forEach((test: VisualizationType) => {
            this.toggleTestOff(test);
        });
    }

    private onUpdateSelectedPivotChild = (payload: UpdateSelectedDetailsViewPayload): void => {
        const pivot = payload.pivotType;
        const pivotChildUpdated = this.updateSelectedPivotChildUnderPivot(payload);
        const pivotUpdated = this.updateSelectedPivot(pivot);
        if (pivotChildUpdated || pivotUpdated) {
            this.disableAllTests();
            this.emitChanged();
        }
    };

    private onScanCompleted = (): void => {
        this.state.scanning = null;
        this.emitChanged();
    };

    private onScrollRequested = (): void => {
        this.state.focusedTarget = null;
        this.emitChanged();
    };

    private onUpdateFocusedInstance = (focusedInstanceTarget: string[]): void => {
        this.state.focusedTarget = focusedInstanceTarget;
        this.emitChanged();
    };

    private onInjectionCompleted = (): void => {
        this.state.injectingInProgress = false;
        this.state.injectingStarted = false;
        this.emitChanged();
    };

    private onInjectionStarted = (): void => {
        if (this.state.injectingStarted) {
            return;
        }

        this.state.injectingInProgress = true;
        this.state.injectingStarted = true;
        this.emitChanged();
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
