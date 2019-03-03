// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { IGroup } from 'office-ui-fabric-react/lib/GroupedList';
import * as React from 'react';

import { IssueDetailsTextGenerator } from '../../background/issue-details-text-generator';
import { RuleResult } from '../../scanner/iruleresults';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { BugButton, BugButtonDeps } from './bug-button';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { DecoratedAxeNodeResult } from '../../injected/scanner-utils';

// tslint:disable-next-line:interface-name
export interface IDetailsRowData extends IObjectWithKey, AxeNodeResult {
    selector: string;
    bugButton: JSX.Element;
}

export interface ListProps {
    items: IDetailsRowData[];
    groups: DetailsGroup[];
}

export interface DetailsGroup extends IGroup {
    guidanceLinks: HyperlinkDefinition[];
    ruleUrl?: string;
}

export class IssuesTableHandler {
    public getListProps(failedRules: RuleResult[]): ListProps {
        let listProps: ListProps;
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
