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
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { outcomeTypeSemantics } from 'reports/components/outcome-type';

export const resultsGroupAutomationId = 'tab-stops-results-group';

export type TabStopsRequirementsWithInstancesDeps = CollapsibleComponentCardsDeps & {
    collapsibleControl: (props: CollapsibleComponentCardsProps) => JSX.Element;
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator | undefined;
    tabStopsFailedCounter: TabStopsFailedCounter;
    tabStopsTestViewController: TabStopsTestViewController | undefined;
};

export type TabStopsRequirementsWithInstancesProps = {
    deps: TabStopsRequirementsWithInstancesDeps;
    results: TabStopsRequirementResult[];
    getCollapsibleComponentPropsWithInstance: (
        result: TabStopsRequirementResult,
        idx: number,
        buttonAriaLabel: string,
    ) => CollapsibleComponentCardsProps;
    getCollapsibleComponentPropsWithoutInstance?: (
        result: TabStopsRequirementResult,
        idx: number,
        buttonAriaLabel: string,
    ) => CollapsibleComponentCardsProps;
};

export const TabStopsRequirementsWithInstances = NamedFC<TabStopsRequirementsWithInstancesProps>(
    'TabStopsRequirementsWithInstances',
    ({
        results,
        deps,
        getCollapsibleComponentPropsWithInstance,
        getCollapsibleComponentPropsWithoutInstance,
    }) => {
        return (
            <div>
                {results.map((requirement, idx) => {
                    const { pastTense } = outcomeTypeSemantics.fail;
                    const instanceCount =
                        deps.tabStopsFailedCounter.getFailedInstancesByRequirementId(
                            results,
                            requirement.id,
                        );
                    const totalCount = deps.tabStopsFailedCounter.getTotalFailedByRequirementId(
                        results,
                        requirement.id,
                    );

                    if (
                        instanceCount === 0 &&
                        getCollapsibleComponentPropsWithoutInstance === undefined
                    ) {
                        return null;
                    }

                    let collapsibleComponentProps: CollapsibleComponentCardsProps;
                    // The aria-label must start with the visible text content of the button so
                    // axe-core 4.12's label-content-name-mismatch rule passes (visible text
                    // must be a substring of the accessible name). The button visibly contains
                    // the OutcomeChip's count, then the requirement name and description. The
                    // past-tense outcome word is appended in parentheses at the end so screen
                    // reader users still hear the outcome. All original information (count,
                    // name, description, outcome) is preserved -- only the ordering is changed.
                    const buttonAriaLabel = `${totalCount} ${requirement.name} ${requirement.description} (${pastTense})`;
                    if (instanceCount === 0) {
                        collapsibleComponentProps = getCollapsibleComponentPropsWithoutInstance!(
                            requirement,
                            idx,
                            buttonAriaLabel,
                        );
                    } else {
                        collapsibleComponentProps = getCollapsibleComponentPropsWithInstance(
                            requirement,
                            idx,
                            buttonAriaLabel,
                        );
                    }
                    const CollapsibleComponent = deps.collapsibleControl(collapsibleComponentProps);

                    return (
                        <React.Fragment key={requirement.id}>{CollapsibleComponent}</React.Fragment>
                    );
                })}
            </div>
        );
    },
);
