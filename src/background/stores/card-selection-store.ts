// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from 'background/actions/tab-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import {
    convertResultsToCardSelectionStoreData,
    ConvertResultsToCardSelectionStoreDataCallback,
    convertUnifiedStoreDataToScanNodeResults,
    ConvertUnifiedStoreDataToScanNodeResultsCallback,
} from 'common/store-data-to-scan-node-result-converter';
import { UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { forOwn, isEmpty } from 'lodash';
import { StoreNames } from '../../common/stores/store-names';
import {
    CardSelectionStoreData,
    RuleExpandCollapseData,
} from '../../common/types/store-data/card-selection-store-data';
import {
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    UnifiedScanCompletedPayload,
} from '../actions/action-payloads';
import { CardSelectionActions } from '../actions/card-selection-actions';
import { UnifiedScanResultActions } from '../actions/unified-scan-result-actions';

export class CardSelectionStore extends PersistentStore<CardSelectionStoreData> {
    constructor(
        private readonly cardSelectionActions: CardSelectionActions,
        private readonly unifiedScanResultActions: UnifiedScanResultActions,
        private readonly tabActions: TabActions,
        persistedState: CardSelectionStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        private readonly convertResultsToCardSelectionStoreDataCallback: ConvertResultsToCardSelectionStoreDataCallback = convertResultsToCardSelectionStoreData,
        private readonly convertDataToScanNodeResults: ConvertUnifiedStoreDataToScanNodeResultsCallback = convertUnifiedStoreDataToScanNodeResults,
    ) {
        super(
            StoreNames.CardSelectionStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.cardSelectionStore(tabId),
            logger,
        );
    }

    protected addActionListeners(): void {
        this.cardSelectionActions.toggleRuleExpandCollapse.addListener(
            this.toggleRuleExpandCollapse,
        );
        this.cardSelectionActions.toggleCardSelection.addListener(this.toggleCardSelection);
        this.cardSelectionActions.collapseAllRules.addListener(this.collapseAllRules);
        this.cardSelectionActions.expandAllRules.addListener(this.expandAllRules);
        this.cardSelectionActions.toggleVisualHelper.addListener(this.toggleVisualHelper);
        this.cardSelectionActions.getCurrentState.addListener(this.onGetCurrentState);
        this.unifiedScanResultActions.scanCompleted.addListener(this.onScanCompleted);
        this.cardSelectionActions.resetFocusedIdentifier.addListener(this.onResetFocusedIdentifier);
        this.cardSelectionActions.navigateToNewCardsView.addListener(this.onNavigateToNewCardsView);
        this.tabActions.existingTabUpdated.addListener(this.onResetStoreData);
    }

    public getDefaultState(): CardSelectionStoreData {
        const defaultValue: CardSelectionStoreData = {
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
        forOwn(this.state.rules, rule => {
            this.deselectAllCardsInRule(rule);
        });
    };

    private toggleRuleExpandCollapse = async (
        payload: RuleExpandCollapsePayload,
    ): Promise<void> => {
        if (!payload || !this.state.rules?.[payload.ruleId]) {
            return;
        }

        const rule = this.state.rules[payload.ruleId];

        rule.isExpanded = !rule.isExpanded;

        if (!rule.isExpanded) {
            this.deselectAllCardsInRule(rule);
        }

        await this.emitChanged();
    };

    private toggleCardSelection = async (payload: CardSelectionPayload): Promise<void> => {
        if (
            !payload ||
            !this.state.rules?.[payload.ruleId] ||
            this.state.rules![payload.ruleId].cards[payload.resultInstanceUid] === undefined
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

        await this.emitChanged();
    };

    private collapseAllRules = async (): Promise<void> => {
        if (!this.state.rules) {
            return;
        }

        forOwn(this.state.rules, rule => {
            rule.isExpanded = false;
            this.deselectAllCardsInRule(rule);
        });

        await this.emitChanged();
    };

    private expandAllRules = async (): Promise<void> => {
        if (!this.state.rules) {
            return;
        }

        forOwn(this.state.rules, rule => {
            rule.isExpanded = true;
        });

        await this.emitChanged();
    };

    private toggleVisualHelper = async (): Promise<void> => {
        this.state.visualHelperEnabled = !this.state.visualHelperEnabled;

        if (!this.state.visualHelperEnabled) {
            this.deselectAllCards();
        }

        await this.emitChanged();
    };

    private onScanCompleted = async (payload: UnifiedScanCompletedPayload): Promise<void> => {
        this.state = this.getDefaultState();
        this.state.rules = {};

        if (!payload) {
            return;
        }

        const results = this.convertDataToScanNodeResults({
            results: payload.scanResult,
        } as UnifiedScanResultStoreData);
        if (results) {
            this.state = this.convertResultsToCardSelectionStoreDataCallback(this.state, results);
        }

        this.state.visualHelperEnabled = true;

        await this.emitChanged();
    };

    private onResetFocusedIdentifier = async (): Promise<void> => {
        this.state.focusedResultUid = null;
        await this.emitChanged();
    };

    private onNavigateToNewCardsView = async (): Promise<void> => {
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
        await this.emitChanged();
    };

    private onResetStoreData = async (): Promise<void> => {
        this.state = this.getDefaultState();
        await this.emitChanged();
    };
}
