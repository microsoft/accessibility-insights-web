// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CheckboxVisibility,
    ColumnActionsMode,
    ConstrainMode,
    DetailsList,
    IColumn,
    Icon,
    Link,
} from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { AssessmentInstanceDetailsColumn } from 'DetailsView/components/assessment-instance-details-column';
import { tabStopsRequirementsTableActionColumnWidthPx } from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { TabStopsRequirementResultInstance } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';
import styles from './tab-stops-requirement-instances-collapsible-content.scss';

export type TabStopsRequirementInstancesCollapsibleContentProps = {
    requirementId: TabStopRequirementId;
    instances: TabStopsRequirementResultInstance[];
    onEditButtonClicked: (
        requirementId: TabStopRequirementId,
        instanceId: string,
        description: string,
    ) => void;
    onRemoveButtonClicked: (requirementId: TabStopRequirementId, instanceId: string) => void;
};
export const TabStopsRequirementInstancesCollapsibleContent =
    NamedFC<TabStopsRequirementInstancesCollapsibleContentProps>(
        'TabStopsRequirementInstancesCollapsibleContent',
        props => {
            const onRenderCapturedInstanceDetailsColumn = (
                instance: TabStopsRequirementResultInstance,
            ): JSX.Element => {
                return (
                    <AssessmentInstanceDetailsColumn
                        background={'#767676'}
                        textContent={instance.description}
                        headerText={'Comment'}
                    />
                );
            };

            const onRenderCapturedInstanceIconsColumn = (
                instance: TabStopsRequirementResultInstance,
            ): JSX.Element => {
                return (
                    <>
                        <Link
                            className={styles.editButton}
                            onClick={() =>
                                props.onEditButtonClicked(
                                    props.requirementId,
                                    instance.id,
                                    instance.description,
                                )
                            }
                        >
                            <Icon iconName="edit" ariaLabel={'edit instance'} />
                        </Link>
                        <Link
                            className={styles.removeButton}
                            onClick={() =>
                                props.onRemoveButtonClicked(props.requirementId, instance.id)
                            }
                        >
                            <Icon iconName="delete" ariaLabel={'delete instance'} />
                        </Link>
                    </>
                );
            };

            const columns: IColumn[] = [
                {
                    key: 'failureDescription',
                    name: 'Failure description',
                    fieldName: 'description',
                    minWidth: 100,
                    isResizable: true,
                    onRender: onRenderCapturedInstanceDetailsColumn,
                    columnActionsMode: ColumnActionsMode.disabled,
                },
                {
                    key: 'instanceActionButtons',
                    name: 'instance actions',
                    isIconOnly: true,
                    fieldName: 'instanceActionButtons',
                    // Matching the Requirements table ensures that corresponding icons line up
                    minWidth: tabStopsRequirementsTableActionColumnWidthPx,
                    maxWidth: tabStopsRequirementsTableActionColumnWidthPx,
                    isResizable: false,
                    onRender: onRenderCapturedInstanceIconsColumn,
                    columnActionsMode: ColumnActionsMode.disabled,
                },
            ];

            return (
                <DetailsList
                    items={props.instances}
                    columns={columns}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    onRenderDetailsHeader={() => null}
                />
            );
        },
    );
