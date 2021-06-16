// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestMode } from '../common/configs/test-mode';
import { VisualizationConfiguration } from '../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../common/enum-helper';
import {
    AssessmentScanData,
    VisualizationStoreData,
} from '../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../common/types/visualization-type';

export class AnalyzerStateUpdateHandler {
    protected prevState: VisualizationStoreData;
    protected startScan: (id: string) => void;
    protected teardown: (id: string) => void;
    private visualizationConfigurationFactory: VisualizationConfigurationFactory;

    constructor(visualizationConfigurationFactory: VisualizationConfigurationFactory) {
        this.visualizationConfigurationFactory = visualizationConfigurationFactory;
    }

    public setupHandlers(
        startScanDelegate: (key: string) => void,
        teardownDelegate: (key: string) => void,
    ): void {
        this.startScan = startScanDelegate;
        this.teardown = teardownDelegate;
    }

    public handleUpdate(currState: VisualizationStoreData): void {
        const prevState = this.prevState;

        this.terminateAnalyzers(prevState, currState);
        this.startAnalyzers(prevState, currState);

        this.prevState = currState;
    }

    private terminateAnalyzers(
        prevState: VisualizationStoreData,
        currState: VisualizationStoreData,
    ): void {
        const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
        types.forEach(visualizationType => {
            if (prevState != null) {
                const configuration =
                    this.visualizationConfigurationFactory.getConfiguration(visualizationType);
                const keys = this.getTestKeysFromConfiguration(configuration, currState);
                keys.forEach(testKey => {
                    if (this.isTestTerminated(configuration, prevState, currState, testKey)) {
                        this.teardown(configuration.getIdentifier(testKey));
                    }
                });
            }
        });
    }

    private startAnalyzers(
        prevState: VisualizationStoreData,
        currState: VisualizationStoreData,
    ): void {
        if (currState.scanning != null && currState.injectingRequested !== true) {
            if (
                prevState == null ||
                prevState.scanning !== currState.scanning ||
                prevState.injectingRequested !== currState.injectingRequested
            ) {
                this.startScan(currState.scanning);
            }
        }
    }

    private isTestTerminated(
        config: VisualizationConfiguration,
        prevState: VisualizationStoreData,
        currState: VisualizationStoreData,
        step: string,
    ): boolean {
        const prevScanState = config.getStoreData(prevState.tests);
        const currScanState = config.getStoreData(currState.tests);
        const prevEnabled = config.getTestStatus(prevScanState, step);
        const currEnabled = config.getTestStatus(currScanState, step);
        return prevState != null && prevEnabled === true && currEnabled === false;
    }

    private getTestKeysFromConfiguration(
        config: VisualizationConfiguration,
        currState: VisualizationStoreData,
    ): string[] {
        const keys = [];
        if (this.isAssessment(config)) {
            const prevScanState = config.getStoreData(currState.tests) as AssessmentScanData;
            Object.keys(prevScanState.stepStatus).forEach(step => {
                keys.push(config.getIdentifier(step));
            });
        } else {
            keys.push(config.getIdentifier());
        }
        return keys;
    }

    private isAssessment(config: VisualizationConfiguration): boolean {
        return config.testMode === TestMode.Assessments;
    }
}
