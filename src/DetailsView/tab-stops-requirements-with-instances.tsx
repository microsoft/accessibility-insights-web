// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CollapsibleComponentCardsDeps,
    CollapsibleComponentCardsProps,
} from 'common/components/cards/collapsible-component-cards';
import { NamedFC } from 'common/react/named-fc';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsMinimalRequirementHeader } from 'DetailsView/tab-stops-minimal-requirement-header';
import { TabStopsRequirementInstancesCollapsibleContent } from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { outcomeTypeSemantics } from 'reports/components/outcome-type';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import * as styles from './tab-stops-requirements-with-instances.scss';

export const resultsGroupAutomationId = 'tab-stops-results-group';

export type TabStopsRequirementsWithInstancesDeps = CollapsibleComponentCardsDeps & {
    collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
    tabStopsFailedCounter: TabStopsFailedCounter;
    tabStopsTestViewController: TabStopsTestViewController;
};

export type TabStopsRequirementsWithInstancesProps = {
    deps: TabStopsRequirementsWithInstancesDeps;
    results: TabStopsRequirementResult[];
    headingLevel: number;
};

export const TabStopsRequirementsWithInstances = NamedFC<TabStopsRequirementsWithInstancesProps>(
    'TabStopsRequirementsWithInstances',
    ({ results, deps, headingLevel }) => {
        const onInstanceRemoveButtonClicked = (
            requirementId: TabStopRequirementId,
            instanceId: string,
        ) => {
            deps.tabStopRequirementActionMessageCreator.removeTabStopInstance(
                requirementId,
                instanceId,
            );
        };
        const onInstanceEditButtonClicked = (
            requirementId: TabStopRequirementId,
            instanceId: string,
            description: string,
        ) => {
            deps.tabStopsTestViewController.editExistingFailureInstance({
                instanceId,
                requirementId,
                description,
            });
        };

        const getCollapsibleComponentProps = (
            result: TabStopsRequirementResult,
            idx: number,
            buttonAriaLabel: string,
        ) => {
            return {
                id: result.id,
                key: `summary-details-${idx + 1}`,
                header: (
                    <TabStopsMinimalRequirementHeader
                        deps={deps}
                        key={result.id}
                        requirement={result}
                    />
                ),
                content: (
                    <TabStopsRequirementInstancesCollapsibleContent
                        key={`${result.id}-requirement-group`}
                        requirementId={result.id}
                        instances={result.instances}
                        onEditButtonClicked={onInstanceEditButtonClicked}
                        onRemoveButtonClicked={onInstanceRemoveButtonClicked}
                    />
                ),
                containerAutomationId: resultsGroupAutomationId,
                containerClassName: styles.collapsibleRequirementDetailsGroup,
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
            <div>
                {results.map((requirement, idx) => {
                    const { pastTense } = outcomeTypeSemantics.fail;
                    const count = deps.tabStopsFailedCounter.getFailedByRequirementId(
                        results,
                        requirement.id,
                    );

                    if (count === 0) {
                        return null;
                    }

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
