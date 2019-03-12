// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestMode } from '../common/configs/test-mode';
import { EnumHelper } from '../common/enum-helper';
import { VisualizationType } from '../common/types/visualization-type';
import { VisualizationConfiguration, VisualizationConfigurationFactory } from './../common/configs/visualization-configuration-factory';
import { IAssessmentScanData, IScanData, IVisualizationStoreData } from './../common/types/store-data/ivisualization-store-data.d';

export class AnalyzerStateUpdateHandler {
    protected prevState: IVisualizationStoreData;
    protected startScan: (id: string) => void;
    protected teardown: (id: string) => void;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;

    constructor(visualizationConfigurationFactory: VisualizationConfigurationFactory) {
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
    }

    public setupHandlers(startScanDelegate: (key: string) => void, teardownDelegate: (key: string) => void): void {
        this.startScan = startScanDelegate;
        this.teardown = teardownDelegate;
    }

    public handleUpdate(currState: IVisualizationStoreData) {
        const prevState = this.prevState;

        this.terminateAnalyzers(prevState, currState);
        this.startAnalyzers(prevState, currState);

        this.prevState = currState;
    }

    private terminateAnalyzers(prevState: IVisualizationStoreData, currState: IVisualizationStoreData): void {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(type => {
            if (prevState != null) {
                const configuration = this.visualizationConfigurationFactory.getConfiguration(type);
                const keys = this.getTestKeysFromConfiguration(configuration, currState);
                keys.forEach(testKey => {
                    if (this.isTestTerminated(configuration, prevState, currState, testKey)) {
                        this.teardown(configuration.getIdentifier(testKey));
                    }
                });
            }
        });
    }

    private startAnalyzers(prevState: IVisualizationStoreData, currState: IVisualizationStoreData): void {
        if (currState.scanning != null && currState.injectingInProgress !== true) {
            if (
                prevState == null ||
                prevState.scanning !== currState.scanning ||
                prevState.injectingInProgress !== currState.injectingInProgress
            ) {
                this.startScan(currState.scanning);
            }
        }
    }

    private isTestTerminated(
        config: VisualizationConfiguration,
        prevState: IVisualizationStoreData,
        currState: IVisualizationStoreData,
        step: string,
    ): boolean {
        const prevScanState = config.getStoreData(prevState.tests);
        const currScanState = config.getStoreData(currState.tests);
        const prevEnabled = config.getTestStatus(prevScanState, step);
        const currEnabled = config.getTestStatus(currScanState, step);
        return prevState != null && prevEnabled === true && currEnabled === false;
    }

    private getTestKeysFromConfiguration(config: VisualizationConfiguration, currState: IVisualizationStoreData) {
        const keys = [];
        if (this.isAssessment(config)) {
            const prevScanState = config.getStoreData(currState.tests) as IAssessmentScanData;
            Object.keys(prevScanState.stepStatus).forEach(step => {
                keys.push(config.getIdentifier(step));
            });
        } else {
            keys.push(config.getIdentifier());
        }
        return keys;
    }

    private isAssessment(config: VisualizationConfiguration) {
        return config.testMode === TestMode.Assessments;
    }
}
