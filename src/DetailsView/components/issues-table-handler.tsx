// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { IGroup } from 'office-ui-fabric-react/lib/GroupedList';
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { RuleResult } from '../../scanner/iruleresults';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { BugButton, IBugButtonDeps } from './bug-button';
import { ConfigIssueTrackerButton } from './config-issue-tracker-button';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';

export interface IDetailsRowData extends IObjectWithKey, AxeNodeResult {
    selector: string;
    bugButton: JSX.Element;
}

export interface IListProps {
    items: IDetailsRowData[];
    groups: DetailsGroup[];
}

export interface DetailsGroup extends IGroup {
    guidanceLinks: HyperlinkDefinition[];
    ruleUrl?: string;
}

export type IssuesTableHandlerDeps = IBugButtonDeps & {
    dropdownClickHandler: DropdownClickHandler;
};
export interface IBugFileDetails {
    deps: IssuesTableHandlerDeps;
    issueTrackerPath: string;
    selectedIdToRuleResultMap: IDictionaryStringTo<DecoratedAxeNodeResult>;
    showBugFiling: boolean;
    pageTitle: string;
    pageUrl: string;
}

export class IssuesTableHandler {
    public getListProps(failedRules: RuleResult[], bugFilingDetails: IBugFileDetails): IListProps {
        let listProps: IListProps;
        const groups: DetailsGroup[] = [];
        const items: IDetailsRowData[] = [];
        let instanceCount: number = 0;
        failedRules.forEach((rule: RuleResult) => {
            const curGroup: DetailsGroup = {
                key: rule.id,
                name: rule.help,
                startIndex: instanceCount,
                isCollapsed: true,
                count: rule.nodes.length,
                guidanceLinks: rule.guidanceLinks,
                ruleUrl: rule.helpUrl,
            };
            groups.push(curGroup);
            rule.nodes.forEach((node: AxeNodeResult) => {
                instanceCount++;
                const detailsRow = node as IDetailsRowData;

                detailsRow.selector = node.target.join(';');
                detailsRow.key = node.instanceId;
                if (bugFilingDetails.showBugFiling) {
                    if (bugFilingDetails.issueTrackerPath) {
                        detailsRow.bugButton = (
                            <BugButton
                                deps={bugFilingDetails.deps}
                                pageTitle={bugFilingDetails.pageTitle}
                                pageUrl={bugFilingDetails.pageUrl}
                                nodeResult={bugFilingDetails.selectedIdToRuleResultMap[node.instanceId]}
                                issueTrackerPath={bugFilingDetails.issueTrackerPath}
                            />
                        );
                    } else {
                        detailsRow.bugButton = (
                            <ConfigIssueTrackerButton onClick={bugFilingDetails.deps.dropdownClickHandler.openSettingsPanelHandler} />
                        );
                    }
                }

                items.push(detailsRow);
            });
        });

        listProps = {
            groups: groups,
            items: items,
        };

        return listProps;
    }
}
