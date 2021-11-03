// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CollapsibleComponentCardsDeps,
    CollapsibleComponentCardsProps,
} from 'common/components/cards/collapsible-component-cards';
import { NamedFC } from 'common/react/named-fc';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsMinimalRequirementHeader } from 'DetailsView/tab-stops-minimal-requirement-header';
import { TabStopsRequirementInstancesCollapsibleContent } from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { outcomeTypeSemantics } from 'reports/components/outcome-type';

import * as styles from './tab-stops-requirements-with-instances.scss';

export const resultsGroupAutomationId = 'tab-stops-results-group';

export type TabStopsRequirementsWithInstancesDeps = CollapsibleComponentCardsDeps & {
    collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
};

export type TabStopsRequirementsWithInstancesProps = {
    deps: TabStopsRequirementsWithInstancesDeps;
    results: TabStopsRequirementResult[];
    headingLevel: number;
};

export const TabStopsRequirementsWithInstances = NamedFC<TabStopsRequirementsWithInstancesProps>(
    'TabStopsRequirementsWithInstances',
    ({ results, deps, headingLevel }) => {
        const getCollapsibleComponentProps = (
            result: TabStopsRequirementResult,
            idx: number,
            buttonAriaLabel: string,
        ) => {
            return {
                id: result.id,
                key: `summary-details-${idx + 1}`,
                header: <TabStopsMinimalRequirementHeader key={result.id} requirement={result} />,
                content: (
                    <TabStopsRequirementInstancesCollapsibleContent
                        key={`${result.id}-requirement-group`}
                        instances={result.instances}
                    />
                ),
                containerAutomationId: resultsGroupAutomationId,
                containerClassName: styles.collapsibleRuleDetailsGroup,
                buttonAriaLabel: buttonAriaLabel,
                headingLevel,
                deps: deps,
                onExpandToggle: (event: React.MouseEvent<HTMLDivElement>) => {
                    deps.tabStopRequirementActionMessageCreator.toggleTabStopRequirementExpand(
                        result.id,
                        event,
                    );
                },
                isExpanded: result.isExpanded,
            };
        };

        return (
            <div className={styles.ruleDetailsGroup}>
                {results.map((requirement, idx) => {
                    const { pastTense } = outcomeTypeSemantics.fail;
                    const count = TabStopsFailedCounter.getFailedByRequirementId(
                        results,
                        requirement.id,
                    );
                    const buttonAriaLabel = `${requirement.id} ${count} ${pastTense} ${requirement.description}`;
                    const CollapsibleComponent = deps.collapsibleControl(
                        getCollapsibleComponentProps(requirement, idx, buttonAriaLabel),
                    );
                    return CollapsibleComponent;
                })}
            </div>
        );
    },
);
