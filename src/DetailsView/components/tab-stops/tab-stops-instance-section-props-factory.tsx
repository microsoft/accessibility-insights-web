// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopsFailedInstanceSectionDeps } from 'DetailsView/components/tab-stops-failed-instance-section';
import { TabStopsMinimalRequirementHeader } from 'DetailsView/tab-stops-minimal-requirement-header';
import { TabStopsRequirementInstancesCollapsibleContent } from 'DetailsView/tab-stops-requirement-instances-collapsible-content';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import { TabStopsRequirementsWithInstancesProps } from 'DetailsView/tab-stops-requirements-with-instances';
import styles from 'DetailsView/tab-stops-requirements-with-instances.scss';
import * as React from 'react';
import { InstanceReportModel } from 'reports/assessment-report-model';
import { TabStopsReportInstanceList } from 'reports/components/report-sections/tab-stops-report-instance-list';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export type TabStopsInstanceSectionPropsFactoryDeps = TabStopsFailedInstanceSectionDeps;
export const resultsGroupAutomationId = 'tab-stops-results-group';

export type TabStopsInstanceSectionPropsFactoryProps = {
    deps: TabStopsInstanceSectionPropsFactoryDeps;
    tabStopRequirementState: TabStopRequirementState;
    results: TabStopsRequirementResult[];
    headingLevel: number;
};

export type TabStopsInstanceSectionPropsFactory = (
    props: TabStopsInstanceSectionPropsFactoryProps,
) => TabStopsRequirementsWithInstancesProps;

export const FastPassTabStopsInstanceSectionPropsFactory: TabStopsInstanceSectionPropsFactory =
    props => {
        const { deps, headingLevel } = props;
        const onInstanceRemoveButtonClicked = (
            requirementId: TabStopRequirementId,
            instanceId: string,
        ) => {
            deps.tabStopRequirementActionMessageCreator!.removeTabStopInstance(
                requirementId,
                instanceId,
            );
        };
        const onInstanceEditButtonClicked = async (
            requirementId: TabStopRequirementId,
            instanceId: string,
            description: string,
        ) => {
            await deps.tabStopsTestViewController!.editExistingFailureInstance({
                instanceId,
                requirementId,
                description,
            });
        };

        const getCollapsibleComponentPropsWithInstance = (
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
                    deps.tabStopRequirementActionMessageCreator!.toggleTabStopRequirementExpand(
                        result.id,
                        event,
                    );
                },
                isExpanded: result.isExpanded,
            };
        };
        return { getCollapsibleComponentPropsWithInstance, ...props };
    };

export const ReportTabStopsInstanceSectionPropsFactory: TabStopsInstanceSectionPropsFactory =
    props => {
        const { deps, headingLevel } = props;
        const getCollapsibleComponentPropsWithoutInstance = (
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
                    <span className={styles.noInstances}>
                        This requirement has failed but no comment has been added
                    </span>
                ),
                containerAutomationId: resultsGroupAutomationId,
                containerClassName: styles.collapsibleRequirementDetailsGroup,
                buttonAriaLabel: buttonAriaLabel,
                headingLevel,
                deps: deps,
                onExpandToggle: () => null,
                isExpanded: result.isExpanded,
            };
        };

        const getCollapsibleComponentPropsWithInstance = (
            result: TabStopsRequirementResult,
            idx: number,
            buttonAriaLabel: string,
        ) => {
            const instances: InstanceReportModel[] = [
                {
                    props: result.instances.map(instance => {
                        return {
                            key: 'Comment',
                            value: instance.description,
                        };
                    }),
                },
            ];

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
                    <TabStopsReportInstanceList
                        key={`${result.id}-requirement-group`}
                        instances={instances}
                    />
                ),
                containerAutomationId: resultsGroupAutomationId,
                containerClassName: styles.collapsibleRequirementDetailsGroup,
                buttonAriaLabel: buttonAriaLabel,
                headingLevel,
                deps: deps,
                onExpandToggle: () => null,
                isExpanded: result.isExpanded,
            };
        };

        return {
            getCollapsibleComponentPropsWithInstance,
            getCollapsibleComponentPropsWithoutInstance,
            ...props,
        };
    };
