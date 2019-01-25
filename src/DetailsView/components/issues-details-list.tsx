// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import {
    ConstrainMode,
    DetailsList,
    DetailsListLayoutMode,
    IColumn,
    ISelection,
    SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

import { FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { RuleResult } from '../../scanner/iruleresults';
import { DetailsGroupHeader, DetailsGroupHeaderProps } from './details-group-header';
import { FailureDetails } from './failure-details';
import { DetailsGroup, IDetailsRowData, IssuesTableHandler } from './issues-table-handler';

export interface IssuesDetailsListProps {
    violations: (RuleResult)[];
    issuesTableHandler: IssuesTableHandler;
    issuesSelection: ISelection;
    pageTitle: string;
    pageUrl: string;
    featureFlagData: FeatureFlagStoreData;
}

export class IssuesDetailsList extends React.Component<IssuesDetailsListProps, {}> {
    private items: IDetailsRowData[];
    private groups: DetailsGroup[];

    private static bugFilingInstanceColumn: IColumn = {
        key: 'bugs',
        name: 'Bugs',
        ariaLabel: 'Bugs',
        fieldName: 'bugButton',
        minWidth: 100,
        maxWidth: 150,
        isResizable: true,
        className: 'content-cell',
        headerClassName: 'content-header',
    };

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
        const detailListProps = this.props.issuesTableHandler.getListProps(
            this.props.violations,
            this.props.featureFlagData[FeatureFlags.showBugFiling],
        );

        this.items = detailListProps.items;
        this.groups = detailListProps.groups;
        const instanceColumns = this.adjustInstanceColumns(this.props.featureFlagData[FeatureFlags.showBugFiling]);
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

    @autobind
    private onRenderGroupHeader(props?: DetailsGroupHeaderProps): JSX.Element {
        const groupHeaderProps: DetailsGroupHeaderProps = {
            ...props,
            countIcon: <Icon iconName="statusErrorFull" className="details-icon-error" />,
        };

        return <DetailsGroupHeader {...groupHeaderProps} />;
    }

    private adjustInstanceColumns(showBugFiling: boolean): IColumn[] {
        if (showBugFiling) {
            return [IssuesDetailsList.bugFilingInstanceColumn].concat(IssuesDetailsList.instanceColumns);
        } else {
            return IssuesDetailsList.instanceColumns;
        }
    }
}
