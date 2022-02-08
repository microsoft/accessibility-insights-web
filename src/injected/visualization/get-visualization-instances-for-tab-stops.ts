// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopsScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { forOwn } from 'lodash';

export const getVisualizationInstancesForTabStops = (
    tabStopScanResultData: TabStopsScanResultData,
    featureFlagData: FeatureFlagStoreData,
) => {
    const tabbedElementsInstances = tabStopScanResultData.tabbedElements.map(element => {
        return {
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: null,
            target: element.target,
            propertyBag: {
                tabOrder: element.tabOrder,
                timestamp: element.timestamp,
            },
        } as AssessmentVisualizationInstance;
    });

    let tabStopRequirementInstances = [];
    forOwn(tabStopScanResultData.requirements, obj => {
        tabStopRequirementInstances = tabStopRequirementInstances.concat(
            obj.instances.map(instance => {
                return {
                    isFailure: true,
                    isVisualizationEnabled: true,
                    ruleResults: null,
                    target: null,
                };
            }),
        );
    });

    return tabbedElementsInstances;
};
