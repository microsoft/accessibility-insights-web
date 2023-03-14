// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentActions } from 'background/actions/assessment-actions';
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import {
    AssessmentCardSelectionInfo,
    AssessmentCardSelectionStoreData,
} from 'common/types/store-data/assessment-card-selection-store-data';
import { AssessmentData } from 'common/types/store-data/assessment-result-data';
import { forEach, forOwn, isEmpty } from 'lodash';
import { StoreNames } from '../../common/stores/store-names';
import {
    CardSelectionStoreData,
    RuleExpandCollapseData,
} from '../../common/types/store-data/card-selection-store-data';
import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentNavigateToNewCardsViewPayload,
    AssessmentResetFocusedIdentifierPayload,
    AssessmentSingleRuleExpandCollapsePayload,
} from '../actions/action-payloads';

export class AssessmentCardSelectionStore extends PersistentStore<AssessmentCardSelectionStoreData> {
    constructor(
        private readonly assessmentCardSelectionActions: AssessmentCardSelectionActions,
        private readonly assessmentActions: AssessmentActions,
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
        // this.assessmentActions.scanCompleted.addListener(this.onScanCompleted);
    }

    public override initialize(initialState?: AssessmentCardSelectionStoreData): void {
        this.state =
            initialState ||
            (this.persistedState ??
                /* assessmentStore persistedState data ??*/ this.getDefaultState());

        this.addActionListeners();
    }
    // assume assessment scan completed and the data is in the payload. check injected controller

    public getDefaultState(): AssessmentCardSelectionStoreData {
        const defaultValue: AssessmentCardSelectionStoreData = {};

        return defaultValue;
    }

    public createStoreDataFromAssessmentInfo(
        assessmentInfo: AssessmentCardSelectionInfo,
    ): AssessmentCardSelectionStoreData {
        let storeData = {};

        forOwn(assessmentInfo, (ruleInstances, testKey) => {
            storeData[testKey] = {
                rules: {},
                visualHelperEnabled: false,
                focusedResultUid: null,
            };
            forOwn(ruleInstances, (instanceUids, ruleId) => {
                storeData[testKey].rules[ruleId] = {
                    isExpanded: false,
                    cards: this.createCardsFromInstances(instanceUids),
                };
            });
        });

        return storeData;
    }

    private createCardsFromInstances(instanceUids: string[]) {
        const cards = {};
        forEach(instanceUids, instanceUid => {
            cards[instanceUid] = false;
        });
        return cards;
    }

    // private getPersistedStateFromAssessment(): AssessmentCardSelectionStoreData {
    //     const assessmentPersistedState = {} as AssessmentData;
    // }

    private deselectAllCards = (): void => {
        forOwn(this.state, test => {
            this.deselectAllCardsInTest(test);
        });
    };

    private deselectAllCardsInTest = (test: CardSelectionStoreData): void => {
        if (!test || !test.rules) {
            return;
        }

        forOwn(test.rules, rule => {
            this.deselectAllCardsInRule(rule);
        });
    };

    private deselectAllCardsInRule = (rule: RuleExpandCollapseData): void => {
        if (!rule) {
            return;
        }

        forOwn(rule.cards, (isSelected, resultInstanceUid, cards) => {
            cards[resultInstanceUid] = false;
        });
    };

    private toggleRuleExpandCollapse = async (
        payload: AssessmentSingleRuleExpandCollapsePayload,
    ): Promise<void> => {
        if (
            !payload ||
            !payload.testKey ||
            !this.state[payload.testKey] ||
            !this.state[payload.testKey].rules ||
            !this.state[payload.testKey].rules?.[payload.ruleId]
        ) {
            return;
        }

        const rule = this.state[payload.testKey].rules![payload.ruleId];

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
            !payload.testKey ||
            !this.state[payload.testKey] ||
            !this.state[payload.testKey].rules?.[payload.ruleId] ||
            this.state[payload.testKey].rules![payload.ruleId].cards[payload.resultInstanceUid] ===
                undefined
        ) {
            return;
        }

        const rule = this.state[payload.testKey].rules![payload.ruleId];
        const isSelected = !rule.cards[payload.resultInstanceUid];
        rule.cards[payload.resultInstanceUid] = isSelected;

        // whenever a card is selected, the visual helper is enabled
        if (isSelected) {
            this.state[payload.testKey].visualHelperEnabled = true;
            this.state[payload.testKey].focusedResultUid = payload.resultInstanceUid;
        }

        await this.emitChanged();
    };

    private collapseAllRules = async (payload: AssessmentExpandCollapsePayload): Promise<void> => {
        if (
            !payload ||
            !payload.testKey ||
            !this.state[payload.testKey] ||
            !this.state[payload.testKey].rules
        ) {
            return;
        }

        forOwn(this.state[payload.testKey].rules!, rule => {
            rule.isExpanded = false;
            this.deselectAllCardsInRule(rule);
        });

        await this.emitChanged();
    };

    private expandAllRules = async (payload: AssessmentExpandCollapsePayload): Promise<void> => {
        if (
            !payload ||
            !payload.testKey ||
            !this.state[payload.testKey] ||
            !this.state[payload.testKey].rules
        ) {
            return;
        }

        forOwn(this.state[payload.testKey].rules!, rule => {
            rule.isExpanded = true;
        });

        await this.emitChanged();
    };

    private toggleVisualHelper = async (
        payload: AssessmentCardToggleVisualHelperPayload,
    ): Promise<void> => {
        if (!payload || !payload.testKey || !this.state[payload.testKey]) {
            return;
        }

        this.state[payload.testKey].visualHelperEnabled =
            !this.state[payload.testKey].visualHelperEnabled;

        if (!this.state[payload.testKey].visualHelperEnabled) {
            this.deselectAllCards();
        }

        await this.emitChanged();
    };

    private onResetFocusedIdentifier = async (
        payload: AssessmentResetFocusedIdentifierPayload,
    ): Promise<void> => {
        if (!payload || !payload.testKey || !this.state[payload.testKey]) {
            return;
        }

        this.state[payload.testKey].focusedResultUid = null;
        await this.emitChanged();
    };

    private onNavigateToNewCardsView = async (
        payload: AssessmentNavigateToNewCardsViewPayload,
    ): Promise<void> => {
        if (!payload || !payload.testKey || !this.state[payload.testKey]) {
            return;
        }

        this.state[payload.testKey].focusedResultUid = null;

        if (this.state[payload.testKey].rules) {
            for (const ruleId in this.state[payload.testKey].rules) {
                this.state[payload.testKey].rules![ruleId].isExpanded = false;
                for (const resultId in this.state[payload.testKey].rules![ruleId].cards) {
                    this.state[payload.testKey].rules![ruleId].cards[resultId] = false;
                }
            }
        }
        this.state[payload.testKey].visualHelperEnabled = !isEmpty(
            this.state[payload.testKey].rules,
        );

        await this.emitChanged();
    };
}
