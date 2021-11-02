// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { requirementsList } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsActionMessageCreator } from 'DetailsView/components/tab-stops/tab-stops-action-message-creator';
import { TabStopsChoiceGroup } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import * as styles from 'DetailsView/components/tab-stops/tab-stops-requirement-table.scss';
import { DetailsList, IColumn } from 'office-ui-fabric-react';
import * as React from 'react';

export interface TabStopsRequirementsTableProps {
    deps: TabStopsRequirementsTableDeps;
    requirementState?: TabStopRequirementState;
}

export type TabStopsRequirementsTableDeps = {
    tabStopsActionMessageCreator?: TabStopsActionMessageCreator;
};

export const TabStopsRequirementsTable = NamedFC<TabStopsRequirementsTableProps>(
    'TabStopsRequirementsTable',
    props => {
        const { deps } = props;
        const { tabStopsActionMessageCreator } = deps;
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
                            onUndoClicked={ev =>
                                tabStopsActionMessageCreator.onUndoClicked(ev, item.id)
                            }
                            onGroupChoiceChange={(ev, status) =>
                                tabStopsActionMessageCreator.onRequirementStatusChange(
                                    ev,
                                    item.id,
                                    status,
                                )
                            }
                            onAddFailureInstanceClicked={ev =>
                                tabStopsActionMessageCreator.onAddFailureInstance(ev, item.id)
                            }
                        />
                    );
                },
            },
        ];

        return <DetailsList items={requirementsList} columns={columns} checkboxVisibility={2} />;
    },
);
