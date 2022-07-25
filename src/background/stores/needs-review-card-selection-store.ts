// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewCardSelectionActions } from 'background/actions/needs-review-card-selection-actions';
import { NeedsReviewScanResultActions } from 'background/actions/needs-review-scan-result-actions';
import { TabActions } from 'background/actions/tab-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { forOwn, isEmpty } from 'lodash';
import { StoreNames } from '../../common/stores/store-names';
import {
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    UnifiedScanCompletedPayload,
} from '../actions/action-payloads';

export class NeedsReviewCardSelectionStore extends PersistentStore<NeedsReviewCardSelectionStoreData> {
    constructor(
        private readonly needsReviewCardSelectionActions: NeedsReviewCardSelectionActions,
        private readonly needsReviewScanResultActions: NeedsReviewScanResultActions,
        private readonly tabActions: TabActions,
        persistedState: NeedsReviewCardSelectionStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
    ) {
        super(
            StoreNames.NeedsReviewCardSelectionStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.needsReviewCardSelectionStore(tabId),
            logger,
            persistStoreData,
        );
    }

    protected addActionListeners(): void {
        this.needsReviewCardSelectionActions.toggleRuleExpandCollapse.addListener(
            this.toggleRuleExpandCollapse,
        );
        this.needsReviewCardSelectionActions.toggleCardSelection.addListener(
            this.toggleCardSelection,
        );
        this.needsReviewCardSelectionActions.collapseAllRules.addListener(this.collapseAllRules);
        this.needsReviewCardSelectionActions.expandAllRules.addListener(this.expandAllRules);
        this.needsReviewCardSelectionActions.toggleVisualHelper.addListener(
            this.toggleVisualHelper,
        );
        this.needsReviewCardSelectionActions.getCurrentState.addListener(this.onGetCurrentState);
        this.needsReviewScanResultActions.scanCompleted.addListener(this.onScanCompleted);
        this.needsReviewCardSelectionActions.resetFocusedIdentifier.addListener(
            this.onResetFocusedIdentifier,
        );
        this.needsReviewCardSelectionActions.navigateToNewCardsView.addListener(
            this.onNavigateToNewCardsView,
        );
        this.tabActions.existingTabUpdated.addListener(this.onResetStoreData);
    }

    public getDefaultState(): NeedsReviewCardSelectionStoreData {
        const defaultValue: NeedsReviewCardSelectionStoreData = {
            rules: null,
            visualHelperEnabled: false,
            focusedResultUid: null,
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

    private deselectAllCards = (): void => {
        if (!this.state.rules) {
            return;
        }

        forOwn(this.state.rules, rule => {
            this.deselectAllCardsInRule(rule);
        });
    };

    private toggleRuleExpandCollapse = (payload: RuleExpandCollapsePayload): void => {
        if (!payload || !this.state.rules?.[payload.ruleId]) {
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
            !this.state.rules?.[payload.ruleId] ||
            this.state.rules[payload.ruleId].cards[payload.resultInstanceUid] === undefined
        ) {
            return;
        }

        const rule = this.state.rules[payload.ruleId];
        const isSelected = !rule.cards[payload.resultInstanceUid];
        rule.cards[payload.resultInstanceUid] = isSelected;

        // whenever a card is selected, the visual helper is enabled
        if (isSelected) {
            this.state.visualHelperEnabled = true;
            this.state.focusedResultUid = payload.resultInstanceUid;
        }

        this.emitChanged();
    };

    private collapseAllRules = (): void => {
        if (!this.state.rules) {
            return;
        }

        forOwn(this.state.rules, rule => {
            rule.isExpanded = false;
            this.deselectAllCardsInRule(rule);
        });

        this.emitChanged();
    };

    private expandAllRules = (): void => {
        if (!this.state.rules) {
            return;
        }

        forOwn(this.state.rules, rule => {
            rule.isExpanded = true;
        });

        this.emitChanged();
    };

    private toggleVisualHelper = (): void => {
        this.state.visualHelperEnabled = !this.state.visualHelperEnabled;

        if (!this.state.visualHelperEnabled) {
            this.deselectAllCards();
        }

        this.emitChanged();
    };

    private onScanCompleted = async (payload: UnifiedScanCompletedPayload): Promise<void> => {
        this.state = this.getDefaultState();
        this.state.rules = {};

        if (!payload) {
            return;
        }

        payload.scanResult.forEach(result => {
            if (result.status !== 'fail' && result.status !== 'unknown') {
                return;
            }

            if (this.state.rules![result.ruleId] === undefined) {
                this.state.rules![result.ruleId] = {
                    isExpanded: false,
                    cards: {},
                };
            }

            this.state.rules![result.ruleId].cards[result.uid] = false;
        });

        this.state.visualHelperEnabled = true;

        this.emitChanged();
    };

    private onResetFocusedIdentifier = (): void => {
        this.state.focusedResultUid = null;
        this.emitChanged();
    };

    private onNavigateToNewCardsView = (): void => {
        this.state.focusedResultUid = null;
        if (this.state.rules) {
            for (const ruleId in this.state.rules) {
                this.state.rules[ruleId].isExpanded = false;
                for (const resultId in this.state.rules[ruleId].cards) {
                    this.state.rules[ruleId].cards[resultId] = false;
                }
            }
        }
        this.state.visualHelperEnabled = !isEmpty(this.state.rules);
        this.emitChanged();
    };

    private onResetStoreData = (): void => {
        this.state = this.getDefaultState();
        this.emitChanged();
    };
}
