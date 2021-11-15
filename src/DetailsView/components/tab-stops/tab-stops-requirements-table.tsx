// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { requirementsList } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsChoiceGroup } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import * as styles from 'DetailsView/components/tab-stops/tab-stops-requirement-table.scss';
import { TabStopsTestViewController } from 'DetailsView/components/tab-stops/tab-stops-test-view-controller';
import { DetailsList, IColumn } from 'office-ui-fabric-react';
import * as React from 'react';

export interface TabStopsRequirementsTableProps {
    deps: TabStopsRequirementsTableDeps;
    requirementState: TabStopRequirementState;
}

export type TabStopsRequirementsTableDeps = {
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
    tabStopsTestViewController: TabStopsTestViewController;
};

export const TabStopsRequirementsTable = NamedFC<TabStopsRequirementsTableProps>(
    'TabStopsRequirementsTable',
    props => {
        const { deps } = props;
        const { tabStopRequirementActionMessageCreator } = deps;
        const columns: IColumn[] = [
            {
                name: 'Requirement',
                key: 'requirement',
                minWidth: 250,
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
                minWidth: 150,
                maxWidth: 150,
                className: styles.passFailColumnCell,
                onRender: item => {
                    return (
                        <TabStopsChoiceGroup
                            status={props.requirementState[item.id].status}
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
                            onAddFailureInstanceClicked={_ =>
                                deps.tabStopsTestViewController.createNewFailureInstancePanel(
                                    item.id,
                                )
                            }
                        />
                    );
                },
            },
        ];

        return <DetailsList items={requirementsList} columns={columns} checkboxVisibility={2} />;
    },
);
