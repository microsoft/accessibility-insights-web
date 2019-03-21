// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationScanResultStore } from '../../../background/stores/visualization-scan-result-store';
import { ITabbedElementData, IVisualizationScanResultData } from '../../../common/types/store-data/ivisualization-scan-result-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { IHtmlElementAxeResults } from '../../../injected/scanner-utils';
import { DictionaryStringTo } from '../../../types/common-types';
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

    public withIssuesSelectedTargets(map: DictionaryStringTo<IHtmlElementAxeResults>): VisualizationScanResultStoreDataBuilder {
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
            default:
                throw new Error(`Unsupported type ${type}`);
        }

        return this;
    }

    public withFullIdToRuleResultMapForIssues(fullIdToRuleResultMap: any): VisualizationScanResultStoreDataBuilder {
        this.data.issues.fullIdToRuleResultMap = fullIdToRuleResultMap;
        return this;
    }

    public withSelectedIdToRuleResultMapForIssues(selectedIdToRuleResultMap: any): VisualizationScanResultStoreDataBuilder {
        this.data.issues.selectedIdToRuleResultMap = selectedIdToRuleResultMap;
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
            default:
                throw new Error(`Unsupported type ${type}`);
        }
        return this;
    }
}
