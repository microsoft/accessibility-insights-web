// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HighlightState } from 'common/components/cards/instance-details-footer';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
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

export type CardsViewModel = {
    cards: CardRuleResultsByStatus;
    visualHelperEnabled: boolean;
    allCardsCollapsed: boolean;
};

export interface CardResult extends UnifiedResult {
    isSelected: boolean;
    highlightStatus: HighlightState;
}
export const AllRuleResultStatuses: CardRuleResultStatus[] = [
    'pass',
    'fail',
    'unknown',
    'inapplicable',
];
