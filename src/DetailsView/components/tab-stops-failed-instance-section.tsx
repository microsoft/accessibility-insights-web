// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ResultSectionTitle } from 'common/components/cards/result-section-title';
import { NamedFC } from 'common/react/named-fc';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { requirements } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import {
    TabStopsRequirementsWithInstances,
    TabStopsRequirementsWithInstancesDeps,
} from 'DetailsView/tab-stops-requirements-with-instances';
import * as React from 'react';
import * as styles from './tab-stops-failed-instance-section.scss';

export type TabStopsFailedInstanceSectionDeps = TabStopsRequirementsWithInstancesDeps & {
    tabStopsFailedCounter: TabStopsFailedCounter;
};

export interface TabStopsFailedInstanceSectionProps {
    deps: TabStopsFailedInstanceSectionDeps;
    visualizationScanResultData: VisualizationScanResultData;
}

export const tabStopsFailedInstanceSectionAutomationId = 'tab-stops-failure-instance-section';

export const TabStopsFailedInstanceSection = NamedFC<TabStopsFailedInstanceSectionProps>(
    'TabStopsFailedInstanceSection',
    props => {
        const results = [];
        const storeData = props.visualizationScanResultData;
        for (const [requirementId, data] of Object.entries(storeData.tabStops.requirements)) {
            if (data.status !== 'fail') {
                continue;
            }

            results.push({
                id: requirementId,
                name: requirements[requirementId].name,
                description: requirements[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            });
        }

        if (results.length === 0) {
            return null;
        }

        return (
            <div
                className={styles.tabStopsFailureInstanceSection}
                data-automation-id={tabStopsFailedInstanceSectionAutomationId}
            >
                <h2>
                    <ResultSectionTitle
                        title="Failed instances"
                        badgeCount={props.deps.tabStopsFailedCounter.getTotalFailed(results)}
                        outcomeType="fail"
                        titleSize="title"
                    />
                </h2>
                <TabStopsRequirementsWithInstances
                    results={results}
                    headingLevel={3}
                    deps={props.deps}
                />
            </div>
        );
    },
);
