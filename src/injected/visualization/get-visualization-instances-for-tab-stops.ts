// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopsScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { forOwn } from 'lodash';

export const GetVisualizationInstancesForTabStops = (
    tabStopScanResultData: TabStopsScanResultData,
    featureFlagData: FeatureFlagStoreData,
): SelectorToVisualizationMap => {
    const ret = {};

    tabStopScanResultData.tabbedElements.forEach(element => {
        const instance = {
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: null,
            target: element.target,
            propertyBag: {
                tabOrder: element.tabOrder,
                timestamp: element.timestamp,
            },
        } as AssessmentVisualizationInstance;

        ret[element.target.join(';')] = instance;
    });

    if (featureFlagData[FeatureFlags.tabStopsAutomation] === true) {
        forOwn(tabStopScanResultData.requirements, obj => {
            obj.instances.forEach(instance => {
                const newInstance = {
                    isFailure: true,
                    isVisualizationEnabled: true,
                    ruleResults: null,
                    target: instance.selector,
                    propertyBag: {},
                };
                ret[newInstance.target.join(';')] = newInstance;
            });
        });
    }

    return ret;
};
