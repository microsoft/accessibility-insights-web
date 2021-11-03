// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { outcomeChipContainer } from 'reports/components/report-sections/minimal-rule-header.scss';

export type TabStopsMinimalRequirementHeaderProps = {
    requirement: TabStopsRequirementResult;
};

export const TabStopsMinimalRequirementHeader = NamedFC<TabStopsMinimalRequirementHeaderProps>(
    'TabStopsMinimalRequirementHeader',
    props => {
        const { requirement } = props;

        const renderCountBadge = () => {
            const count = TabStopsFailedCounter.getFailedByRequirementId(
                [requirement],
                requirement.id,
            );

            return (
                <span aria-hidden="true">
                    <OutcomeChip count={count} outcomeType={'fail'} />
                </span>
            );
        };

        const renderRuleName = () => <span className="rule-details-id">{requirement.name}</span>;

        const renderDescription = () => (
            <span className="rule-details-description">{requirement.description}</span>
        );

        return (
            <span className="rule-detail">
                <span className={outcomeChipContainer}>{renderCountBadge()}</span>
                <span>
                    {renderRuleName()}: {renderDescription()}
                </span>
            </span>
        );
    },
);
