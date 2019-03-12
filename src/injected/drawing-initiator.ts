// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DrawingController, VisualizationWindowMessage } from './drawing-controller';
import { AxeResultsWithFrameLevel, IAssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';
import { IPropertyBags, VisualizationInstanceProcessorCallback } from './visualization-instance-processor';

export class DrawingInitiator {
    private drawingController: DrawingController;

    constructor(drawingController: DrawingController) {
        this.drawingController = drawingController;
    }

    public enableVisualization(
        visualizationType: VisualizationType,
        featureFlagStoreData: FeatureFlagStoreData,
        selectorMap: DictionaryStringTo<IAssessmentVisualizationInstance>,
        configId: string,
        processor: VisualizationInstanceProcessorCallback<IPropertyBags, IPropertyBags>,
    ): void {
        if (selectorMap == null) {
            return;
        }

        const elementResults: IAssessmentVisualizationInstance[] = processor(this.getElementResults(selectorMap));

        this.initializeTargetIndex(elementResults);

        const visualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: true,
            elementResults: elementResults,
            featureFlagStoreData: featureFlagStoreData,
            configId: configId,
        };

        this.drawingController.processRequest(visualizationMessage);
    }

    private initializeTargetIndex(elementResults: AxeResultsWithFrameLevel[]) {
        if (elementResults != null) {
            elementResults.forEach(result => {
                result.targetIndex = 0;
            });
        }
    }

    public disableVisualization(visualizationType: VisualizationType, featureFlagStoreData: FeatureFlagStoreData, configId: string): void {
        const visualizationMessage: VisualizationWindowMessage = {
            visualizationType: visualizationType,
            isEnabled: false,
            featureFlagStoreData: featureFlagStoreData,
            configId: configId,
        };

        this.drawingController.processRequest(visualizationMessage);
    }

    private getElementResults(selectorMap: DictionaryStringTo<IAssessmentVisualizationInstance>) {
        return Object.keys(selectorMap).map(key => selectorMap[key]);
    }
}
