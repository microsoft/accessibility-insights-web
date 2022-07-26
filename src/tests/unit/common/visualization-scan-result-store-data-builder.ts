// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import {
    TabbedElementData,
    TabStopRequirementState,
    VisualizationScanResultData,
} from '../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { BaseDataBuilder } from './base-data-builder';

export class VisualizationScanResultStoreDataBuilder extends BaseDataBuilder<VisualizationScanResultData> {
    constructor(generateUID?: () => 'abc') {
        super();
        this.data = new VisualizationScanResultStore(
            null,
            null,
            null,
            null,
            generateUID,
            null,
            null,
            null,
            null,
            null,
            null,
        ).getDefaultState();
    }

    public withTabStopsTabbedElements(
        elements: TabbedElementData[],
    ): VisualizationScanResultStoreDataBuilder {
        this.data.tabStops.tabbedElements = elements;
        return this;
    }

    public withTabbingCompleted(completed: boolean): VisualizationScanResultStoreDataBuilder {
        this.data.tabStops.tabbingCompleted = completed;
        return this;
    }

    public withNeedToCollectTabbingResults(
        needToCollectTabbingResults: boolean,
    ): VisualizationScanResultStoreDataBuilder {
        this.data.tabStops.needToCollectTabbingResults = needToCollectTabbingResults;
        return this;
    }

    public withTabStopRequirement(
        requirement: TabStopRequirementState,
    ): VisualizationScanResultStoreDataBuilder {
        const requirementId = Object.keys(requirement)[0];
        this.data.tabStops.requirements[requirementId] = requirement[requirementId];
        return this;
    }

    public withSelectorMap(
        visualizationType: VisualizationType,
        selectorMap: any,
    ): VisualizationScanResultStoreDataBuilder {
        switch (visualizationType) {
            case VisualizationType.Headings:
                this.data.headings.fullAxeResultsMap = selectorMap;
                break;
            case VisualizationType.Issues:
                this.data.issues.fullAxeResultsMap = selectorMap;
                break;
            case VisualizationType.Landmarks:
                this.data.landmarks.fullAxeResultsMap = selectorMap;
                break;
            case VisualizationType.Color:
                this.data.color.fullAxeResultsMap = selectorMap;
                break;
            case VisualizationType.AccessibleNames:
                this.data.accessibleNames.fullAxeResultsMap = selectorMap;
                break;
            default:
                throw new Error(`Unsupported type ${visualizationType}`);
        }

        return this;
    }

    public withFullIdToRuleResultMapForIssues(
        fullIdToRuleResultMap: any,
    ): VisualizationScanResultStoreDataBuilder {
        this.data.issues.fullIdToRuleResultMap = fullIdToRuleResultMap;
        return this;
    }

    public withScanResult(
        visualizationType: VisualizationType,
        result: any,
    ): VisualizationScanResultStoreDataBuilder {
        switch (visualizationType) {
            case VisualizationType.Headings:
                this.data.headings.scanResult = result;
                break;
            case VisualizationType.Issues:
                this.data.issues.scanResult = result;
                break;
            case VisualizationType.Landmarks:
                this.data.landmarks.scanResult = result;
                break;
            case VisualizationType.Color:
                this.data.color.scanResult = result;
                break;
            case VisualizationType.AccessibleNames:
                this.data.accessibleNames.scanResult = result;
                break;
            default:
                throw new Error(`Unsupported type ${visualizationType}`);
        }
        return this;
    }
}
