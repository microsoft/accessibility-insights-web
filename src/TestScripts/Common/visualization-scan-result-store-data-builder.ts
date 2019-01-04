// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ITabbedElementData,
    IVisualizationScanResultData,
} from '../../common/types/store-data/ivisualization-scan-result-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { IHtmlElementAxeResults } from '../../injected/scanner-utils';
import { VisualizationScanResultStore } from './../../background/stores/visualization-scan-result-store';
import { BaseDataBuilder } from './base-data-builder';

export class VisualizationScanResultStoreDataBuilder extends BaseDataBuilder<IVisualizationScanResultData> {

    constructor() {
        super();
        this.data = new VisualizationScanResultStore(null, null).getDefaultState();
    }

    public withTabStopsTabbedElements(elements: ITabbedElementData[]): VisualizationScanResultStoreDataBuilder {
        this.data.tabStops.tabbedElements = elements;
        return this;
    }

    public withIssuesSelectedTargets(map: IDictionaryStringTo<IHtmlElementAxeResults>): VisualizationScanResultStoreDataBuilder {
        this.data.issues.selectedAxeResultsMap = map;
        return this;
    }

    public withSelectorMap(type: VisualizationType, selectorMap: any): VisualizationScanResultStoreDataBuilder {
        switch (type) {
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
        }

        return this;
    }

    public withFullIdToRuleResultMap(type: VisualizationType, fullIdToRuleResultMap: any): VisualizationScanResultStoreDataBuilder {
        switch (type) {
            case VisualizationType.Issues:
                this.data.issues.fullIdToRuleResultMap = fullIdToRuleResultMap;
                break;
        }

        return this;
    }

    public withSelectedIdToRuleResultMap(type: VisualizationType, selectedIdToRuleResultMap: any): VisualizationScanResultStoreDataBuilder {
        switch (type) {
            case VisualizationType.Issues:
                this.data.issues.selectedIdToRuleResultMap = selectedIdToRuleResultMap;
                break;
        }

        return this;
    }

    public withScanResult(type: VisualizationType, result: any): VisualizationScanResultStoreDataBuilder {
        switch (type) {
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
        }
        return this;
    }
}
