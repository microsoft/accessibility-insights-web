// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';
import { StoreNames } from '../../common/stores/store-names';
import { CardSelectionStoreData, RuleExpandCollapseData } from '../../common/types/store-data/card-selection-store-data';
import { CardSelectionPayload, RuleExpandCollapsePayload, UnifiedScanCompletedPayload } from '../actions/action-payloads';
import { CardSelectionActions } from '../actions/card-selection-actions';
import { UnifiedScanResultActions } from '../actions/unified-scan-result-actions';
import { BaseStoreImpl } from './base-store-impl';

export class CardSelectionStore extends BaseStoreImpl<CardSelectionStoreData> {
    constructor(
        private readonly cardSelectionActions: CardSelectionActions,
        private readonly unifiedScanResultActions: UnifiedScanResultActions,
    ) {
        super(StoreNames.CardSelectionStore);
    }

    protected addActionListeners(): void {
        this.cardSelectionActions.toggleRuleExpandCollapse.addListener(this.toggleRuleExpandCollapse);
        this.cardSelectionActions.toggleCardSelection.addListener(this.toggleCardSelection);
        this.cardSelectionActions.collapseAllRules.addListener(this.collapseAllRules);
        this.cardSelectionActions.getCurrentState.addListener(this.onGetCurrentState);
        this.unifiedScanResultActions.scanCompleted.addListener(this.onScanCompleted);
    }

    public getDefaultState(): CardSelectionStoreData {
        const defaultValue: CardSelectionStoreData = {
            rules: {},
        };

        return defaultValue;
    }

    private deselectAllCardsInRule = (rule: RuleExpandCollapseData): void => {
        if (!rule) {
            return;
        }

        forOwn(rule.cards, (isSelected, resultInstanceUid, cards) => {
            cards[resultInstanceUid] = false;
        });
    };

    private toggleRuleExpandCollapse = (payload: RuleExpandCollapsePayload): void => {
        if (!payload || !this.state.rules[payload.ruleId]) {
            return;
        }

        const rule = this.state.rules[payload.ruleId];

        rule.isExpanded = !rule.isExpanded;

        if (!rule.isExpanded) {
            this.deselectAllCardsInRule(rule);
        }

        this.emitChanged();
    };

    private toggleCardSelection = (payload: CardSelectionPayload): void => {
        if (
            !payload ||
            !this.state.rules[payload.ruleId] ||
            this.state.rules[payload.ruleId].cards[payload.resultInstanceUid] === undefined
        ) {
            return;
        }

        const rule = this.state.rules[payload.ruleId];

        rule.cards[payload.resultInstanceUid] = !rule.cards[payload.resultInstanceUid];

        this.emitChanged();
    };

    private collapseAllRules = (): void => {
        forOwn(this.state.rules, (rule, ruleId) => {
            rule.isExpanded = false;
            this.deselectAllCardsInRule(rule);
        });

        this.emitChanged();
    };

    private onScanCompleted = (payload: UnifiedScanCompletedPayload): void => {
        this.state = this.getDefaultState();

        if (!payload) {
            return;
        }

        payload.scanResult.forEach(result => {
            if (result.status !== 'fail') {
                return;
            }

            if (this.state[result.ruleId] === undefined) {
                this.state.rules[result.ruleId] = {
                    isExpanded: false,
                    cards: {},
                };
            }

            this.state.rules[result.ruleId].cards[result.uid] = false;
        });

        this.emitChanged();
    };
}
