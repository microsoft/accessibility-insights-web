// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceLink } from '../../../scanner/rule-to-links-mappings';
import { InstanceResultStatus, UnifiedResult } from './unified-data-interface';
export type CardRuleResultStatus = InstanceResultStatus | 'inapplicable';
export interface CardRuleResult {
    id: string;
    nodes: CardResult[];
    description: string;
    url: string;
    guidance: GuidanceLink[];
    isExpanded: boolean;
}
export type CardRuleResultsByStatus = {
    [key in CardRuleResultStatus]: CardRuleResult[];
};
export interface CardResult extends UnifiedResult {
    isSelected: boolean;
}
export const AllRuleResultStatuses: CardRuleResultStatus[] = ['pass', 'fail', 'unknown', 'inapplicable'];
