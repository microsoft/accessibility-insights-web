// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, ISelection, SelectionMode } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';

import { RuleResult } from '../../scanner/iruleresults';
import { DetailsGroupHeader, DetailsGroupHeaderProps } from './details-group-header';
import { FailureDetails } from './failure-details';
import { DetailsGroup, DetailsRowData, IssuesTableHandler } from './issues-table-handler';

export interface IssuesDetailsListProps {
    violations: RuleResult[];
    issuesTableHandler: IssuesTableHandler;
    issuesSelection: ISelection;
}

export class IssuesDetailsList extends React.Component<IssuesDetailsListProps> {
    private items: DetailsRowData[];
    private groups: DetailsGroup[];

    private static instanceColumns: IColumn[] = [
        {
            key: 'target',
            name: 'Path',
            ariaLabel: 'Path',
            fieldName: 'selector',
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            className: 'content-cell',
            headerClassName: 'content-header',
        },
        {
            key: 'html',
            name: 'Snippet',
            ariaLabel: 'Snippet',
            fieldName: 'html',
            minWidth: 200,
            maxWidth: 400,
            isResizable: true,
            className: 'content-cell insights-code',
        },
        {
            key: 'fix',
            name: 'How to fix',
            ariaLabel: 'How to fix',
            fieldName: 'failureSummary',
            minWidth: 200,
            maxWidth: 400,
            isResizable: true,
            className: 'content-cell',
        },
    ];

    public shouldComponentUpdate(): boolean {
        return false;
    }

    public render(): JSX.Element {
        const detailListProps = this.props.issuesTableHandler.getListProps(this.props.violations);

        this.items = detailListProps.items;
        this.groups = detailListProps.groups;
        const instanceColumns = IssuesDetailsList.instanceColumns;
        return (
            <div className="issues-details-list">
                <FailureDetails items={this.items} />
                <DetailsList
                    groupProps={{
                        isAllGroupsCollapsed: true,
                        onRenderHeader: this.onRenderGroupHeader,
                    }}
                    items={this.items}
                    groups={this.groups}
                    columns={instanceColumns}
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    ariaLabelForSelectionColumn="Toggle selection"
                    constrainMode={ConstrainMode.unconstrained}
                    selectionMode={SelectionMode.multiple}
                    selection={this.props.issuesSelection}
                    selectionPreservedOnEmptyClick={true}
                    setKey="key"
                    className="details-list"
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                />
            </div>
        );
    }

    private onRenderGroupHeader = (props?: DetailsGroupHeaderProps): JSX.Element => {
        const groupHeaderProps: DetailsGroupHeaderProps = {
            ...props,
            countIcon: <Icon iconName="statusErrorFull" className="details-icon-error" />,
        };

        return <DetailsGroupHeader {...groupHeaderProps} />;
    };
}
