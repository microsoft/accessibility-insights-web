// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CheckboxVisibility, DetailsList, IColumn } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import {
    TabStopRequirementState,
    TabStopRequirementStatuses,
} from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { requirementsList } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsChoiceGroup } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import styles from 'DetailsView/components/tab-stops/tab-stops-requirement-table.scss';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import * as React from 'react';

export interface TabStopsRequirementsTableProps {
    deps: TabStopsRequirementsTableDeps;
    requirementState: TabStopRequirementState;
}

export type TabStopsRequirementsTableDeps = {
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
    tabStopsTestViewController: TabStopsTestViewController;
};

export const tabStopsRequirementsTableActionColumnWidthPx = 124;

export const TabStopsRequirementsTable = NamedFC<TabStopsRequirementsTableProps>(
    'TabStopsRequirementsTable',
    props => {
        const { deps } = props;
        const { tabStopRequirementActionMessageCreator } = deps;
        const columns: IColumn[] = [
            {
                name: 'Requirement',
                key: 'requirement',
                minWidth: 100,
                onRender: item => (
                    <span className={styles.requirementColumn}>
                        <span className={styles.requirementName}>{item.name}</span>:{' '}
                        {item.description}
                    </span>
                ),
            },
            {
                name: 'Pass / Fail',
                key: 'result',
                minWidth: tabStopsRequirementsTableActionColumnWidthPx,
                maxWidth: tabStopsRequirementsTableActionColumnWidthPx,
                className: styles.passFailColumnCell,
                onRender: item => {
                    return (
                        <TabStopsChoiceGroup
                            status={
                                TabStopRequirementStatuses[props.requirementState[item.id]?.status]
                            }
                            onUndoClicked={_ =>
                                tabStopRequirementActionMessageCreator.resetStatusForRequirement(
                                    item.id,
                                )
                            }
                            onGroupChoiceChange={(_, status) =>
                                tabStopRequirementActionMessageCreator.updateTabStopRequirementStatus(
                                    item.id,
                                    status,
                                )
                            }
                            onAddFailureInstanceClicked={async _ =>
                                await deps.tabStopsTestViewController.createNewFailureInstancePanel(
                                    item.id,
                                )
                            }
                        />
                    );
                },
            },
        ];

        return (
            <DetailsList
                className={styles.requirementTable}
                items={requirementsList}
                columns={columns}
                checkboxVisibility={CheckboxVisibility.hidden}
            />
        );
    },
);
