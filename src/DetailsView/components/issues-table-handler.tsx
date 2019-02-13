// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { IGroup } from 'office-ui-fabric-react/lib/GroupedList';
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { RuleResult } from '../../scanner/iruleresults';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { BugButton } from './bug-button';
import { ConfigIssueTrackerButton } from './config-issue-tracker-button';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';

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

export interface IBugFileDetails {
    issueTrackerPath: string;
    pageTitle: string;
    pageUrl: string;
    issueTextGenerator: IssueDetailsTextGenerator;
    showBugFiling: boolean;
    dropdownClickHandler: DropdownClickHandler;
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
            {
                rule;
            }
            rule.nodes.forEach((node: AxeNodeResult) => {
                instanceCount++;
                const detailsRow = node as IDetailsRowData;

                detailsRow.selector = node.target.join(';');
                detailsRow.key = node.instanceId;
                if (bugFilingDetails.showBugFiling) {
                    if (bugFilingDetails.issueTrackerPath) {
                        detailsRow.bugButton = (
                            <BugButton
                                issueTrackerPath={bugFilingDetails.issueTrackerPath}
                                ruleRes={rule}
                                selector={detailsRow.selector}
                                result={node}
                                {...bugFilingDetails}
                            />
                        );
                    } else {
                        detailsRow.bugButton = (
                            <ConfigIssueTrackerButton onClick={bugFilingDetails.dropdownClickHandler.openSettingsPanelHandler} />
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
