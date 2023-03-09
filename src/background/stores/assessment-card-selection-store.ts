// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { forOwn, isEmpty } from 'lodash';
import { StoreNames } from '../../common/stores/store-names';
import { RuleExpandCollapseData } from '../../common/types/store-data/card-selection-store-data';
import {
    AssessmentCardSelectionPayload,
    RuleExpandCollapsePayload,
} from '../actions/action-payloads';

export class AssessmentCardSelectionStore extends PersistentStore<AssessmentCardSelectionStoreData> {
    constructor(
        private readonly assessmentCardSelectionActions: AssessmentCardSelectionActions,
        persistedState: AssessmentCardSelectionStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
    ) {
        super(
            StoreNames.AssessmentCardSelectionStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.assessmentCardSelectionStore(tabId),
            logger,
            persistStoreData,
        );
    }

    protected addActionListeners(): void {
        this.assessmentCardSelectionActions.toggleRuleExpandCollapse.addListener(
            this.toggleRuleExpandCollapse,
        );
        this.assessmentCardSelectionActions.toggleCardSelection.addListener(
            this.toggleCardSelection,
        );
        this.assessmentCardSelectionActions.collapseAllRules.addListener(this.collapseAllRules);
        this.assessmentCardSelectionActions.expandAllRules.addListener(this.expandAllRules);
        this.assessmentCardSelectionActions.toggleVisualHelper.addListener(this.toggleVisualHelper);
        this.assessmentCardSelectionActions.getCurrentState.addListener(this.onGetCurrentState);
        this.assessmentCardSelectionActions.resetFocusedIdentifier.addListener(
            this.onResetFocusedIdentifier,
        );
        this.assessmentCardSelectionActions.navigateToNewCardsView.addListener(
            this.onNavigateToNewCardsView,
        );
    }

    public getDefaultState(): AssessmentCardSelectionStoreData {
        const defaultValue: AssessmentCardSelectionStoreData = {
            testKey: {
                rules: null,
                visualHelperEnabled: false,
                focusedResultUid: null,
            },
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
        if (!this.state.testKey.rules) {
            return;
        }

        forOwn(this.state.testKey.rules, rule => {
            this.deselectAllCardsInRule(rule);
        });
    };

    private toggleRuleExpandCollapse = async (
        payload: RuleExpandCollapsePayload,
    ): Promise<void> => {
        if (!payload || !this.state.testKey.rules?.[payload.ruleId]) {
            return;
        }

        const rule = this.state.testKey.rules[payload.ruleId];

        rule.isExpanded = !rule.isExpanded;

        if (!rule.isExpanded) {
            this.deselectAllCardsInRule(rule);
        }

        await this.emitChanged();
    };

    private toggleCardSelection = async (
        payload: AssessmentCardSelectionPayload,
    ): Promise<void> => {
        if (
            !payload ||
            !this.state.testKey.rules?.[payload.ruleId] ||
            this.state.testKey.rules![payload.ruleId].cards[payload.resultInstanceUid] === undefined
        ) {
            return;
        }

        const rule = this.state.testKey.rules[payload.ruleId];
        const isSelected = !rule.cards[payload.resultInstanceUid];
        rule.cards[payload.resultInstanceUid] = isSelected;

        // whenever a card is selected, the visual helper is enabled
        if (isSelected) {
            this.state.testKey.visualHelperEnabled = true;
            this.state.testKey.focusedResultUid = payload.resultInstanceUid;
        }

        await this.emitChanged();
    };

    private collapseAllRules = async (): Promise<void> => {
        if (!this.state.testKey.rules) {
            return;
        }

        forOwn(this.state.testKey.rules, rule => {
            rule.isExpanded = false;
            this.deselectAllCardsInRule(rule);
        });

        await this.emitChanged();
    };

    private expandAllRules = async (): Promise<void> => {
        if (!this.state.testKey.rules) {
            return;
        }

        forOwn(this.state.testKey.rules, rule => {
            rule.isExpanded = true;
        });

        await this.emitChanged();
    };

    private toggleVisualHelper = async (): Promise<void> => {
        this.state.testKey.visualHelperEnabled = !this.state.testKey.visualHelperEnabled;

        if (!this.state.testKey.visualHelperEnabled) {
            this.deselectAllCards();
        }

        await this.emitChanged();
    };

    private onResetFocusedIdentifier = async (): Promise<void> => {
        this.state.testKey.focusedResultUid = null;
        await this.emitChanged();
    };

    private onNavigateToNewCardsView = async (): Promise<void> => {
        this.state.testKey.focusedResultUid = null;

        if (this.state.testKey.rules) {
            for (const ruleId in this.state.testKey.rules) {
                this.state.testKey.rules[ruleId].isExpanded = false;
                for (const resultId in this.state.testKey.rules[ruleId].cards) {
                    this.state.testKey.rules[ruleId].cards[resultId] = false;
                }
            }
        }
        this.state.testKey.visualHelperEnabled = !isEmpty(this.state.testKey.rules);
        await this.emitChanged();
    };
}
