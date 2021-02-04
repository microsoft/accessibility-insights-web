// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { IObjectWithKey } from 'office-ui-fabric-react';
import { IGroup } from 'office-ui-fabric-react';
import { RuleResult } from 'scanner/iruleresults';

export interface DetailsRowData extends IObjectWithKey, AxeNodeResult {
    selector: string;
}

export interface ListProps {
    items: DetailsRowData[];
    groups: DetailsGroup[];
}

export interface DetailsGroup extends IGroup {
    guidanceLinks?: HyperlinkDefinition[];
    ruleUrl?: string;
}

export class IssuesTableHandler {
    public getListProps(failedRules: RuleResult[]): ListProps {
        const groups: DetailsGroup[] = [];
        const items: DetailsRowData[] = [];
        let instanceCount: number = 0;
        failedRules.forEach((rule: RuleResult) => {
            const curGroup: DetailsGroup = {
                key: rule.id,
                name: rule.help ?? rule.id,
                startIndex: instanceCount,
                isCollapsed: true,
                count: rule.nodes.length,
                guidanceLinks: rule.guidanceLinks,
                ruleUrl: rule.helpUrl,
            };
            groups.push(curGroup);
            rule.nodes.forEach((node: AxeNodeResult) => {
                instanceCount++;
                const detailsRow = node as DetailsRowData;

                detailsRow.selector = node.target.join(';');
                detailsRow.key = node.instanceId;
                items.push(detailsRow);
            });
        });

        return {
            groups: groups,
            items: items,
        };
    }
}
