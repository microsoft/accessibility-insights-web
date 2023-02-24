// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { OutcomeChip } from 'reports/components/outcome-chip';
import styles from '../DetailsView/tab-stops-minimal-requirement-header.scss';

export interface TabStopsMinimalRequirementHeaderDeps {
    tabStopsFailedCounter: TabStopsFailedCounter;
}

export type TabStopsMinimalRequirementHeaderProps = {
    deps: TabStopsMinimalRequirementHeaderDeps;
    requirement: TabStopsRequirementResult;
};

export const TabStopsMinimalRequirementHeader = NamedFC<TabStopsMinimalRequirementHeaderProps>(
    'TabStopsMinimalRequirementHeader',
    props => {
        const { requirement } = props;

        const renderCountBadge = () => {
            const count = props.deps.tabStopsFailedCounter.getTotalFailedByRequirementId(
                [requirement],
                requirement.id,
            );

            return (
                <span aria-hidden="true">
                    <OutcomeChip count={count} outcomeType={'fail'} />
                </span>
            );
        };

        const renderRuleName = () => (
            <span className={styles.requirementDetailsId}>
                <strong>{requirement.name}</strong>
            </span>
        );

        const renderDescription = () => (
            <span className={styles.requirementDetailDescription}>{requirement.description}</span>
        );

        return (
            <span className={styles.requirementDetail}>
                <span>{renderCountBadge()}</span>
                <span>
                    {renderRuleName()}: {renderDescription()}
                </span>
            </span>
        );
    },
);
