// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from '../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';

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
        if (prevState == null) {
            return;
        }

        this.visualizationConfigurationFactory.forEachConfig(
            (configuration, type, requirementConfig) => {
                if (
                    !this.isTestTerminated(
                        configuration,
                        prevState,
                        currState,
                        requirementConfig?.key,
                    )
                ) {
                    return;
                }

                const identifier = configuration.getIdentifier(requirementConfig?.key);
                this.teardown(identifier);
            },
        );
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
        requirement: string,
    ): boolean {
        const prevScanState = config.getStoreData(prevState.tests);
        const currScanState = config.getStoreData(currState.tests);
        const prevEnabled = config.getTestStatus(prevScanState, requirement);
        const currEnabled = config.getTestStatus(currScanState, requirement);
        return prevEnabled === true && currEnabled === false;
    }
}
