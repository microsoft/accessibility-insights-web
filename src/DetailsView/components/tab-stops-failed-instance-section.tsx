// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ResultSectionTitle } from 'common/components/cards/result-section-title';
import { HeadingElementForLevel, HeadingLevel } from 'common/components/heading-element-for-level';
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import * as styles from 'DetailsView/components/tab-stops-failed-instance-section.scss';
import { requirements } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsInstanceSectionPropsFactory } from 'DetailsView/components/tab-stops/tab-stops-instance-section-props-factory';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import {
    TabStopsRequirementsWithInstances,
    TabStopsRequirementsWithInstancesDeps,
} from 'DetailsView/tab-stops-requirements-with-instances';
import * as React from 'react';

export type TabStopsFailedInstanceSectionDeps = TabStopsRequirementsWithInstancesDeps & {
    tabStopsFailedCounter: TabStopsFailedCounter;
    tabStopsInstanceSectionPropsFactory: TabStopsInstanceSectionPropsFactory;
    getNextHeadingLevel: (headingLevel: HeadingLevel) => HeadingLevel;
};

export interface TabStopsFailedInstanceSectionProps {
    deps: TabStopsFailedInstanceSectionDeps;
    tabStopRequirementState: TabStopRequirementState;
    alwaysRenderSection: boolean;
    sectionHeadingLevel: HeadingLevel;
    featureFlagStoreData: FeatureFlagStoreData;
}

export const tabStopsFailedInstanceSectionAutomationId = 'tab-stops-failure-instance-section';

export const TabStopsFailedInstanceSection = NamedFC<TabStopsFailedInstanceSectionProps>(
    'TabStopsFailedInstanceSection',
    props => {
        const results = [];

        for (const [requirementId, data] of Object.entries(props.tabStopRequirementState)) {
            if (data.status !== 'fail') {
                continue;
            }
            const displayAutomatedInfo =
                props.featureFlagStoreData != null &&
                props.featureFlagStoreData[FeatureFlags.tabStopsAutomation];

            results.push({
                id: requirementId,
                name: requirements(displayAutomatedInfo)[requirementId].name,
                description: requirements(displayAutomatedInfo)[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            });
        }

        const totalFailedInstancesCount: number =
            props.deps.tabStopsFailedCounter.getTotalFailed(results);

        if (!props.alwaysRenderSection && totalFailedInstancesCount === 0) {
            return null;
        }

        const instanceSectionProps = props.deps.tabStopsInstanceSectionPropsFactory({
            headingLevel: props.deps.getNextHeadingLevel(props.sectionHeadingLevel),
            results,
            tabStopRequirementState: props.tabStopRequirementState,
            deps: props.deps,
        });

        return (
            <div
                className={styles.tabStopsFailureInstanceSection}
                data-automation-id={tabStopsFailedInstanceSectionAutomationId}
            >
                <HeadingElementForLevel headingLevel={props.sectionHeadingLevel}>
                    <ResultSectionTitle
                        title="Failed instances"
                        badgeCount={totalFailedInstancesCount}
                        outcomeType="fail"
                        titleSize="title"
                    />
                </HeadingElementForLevel>
                <TabStopsRequirementsWithInstances {...instanceSectionProps} />
            </div>
        );
    },
);
