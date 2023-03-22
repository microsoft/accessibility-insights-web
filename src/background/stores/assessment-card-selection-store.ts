// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import {
    convertAssessmentStoreDataToScanNodeResults,
    convertResultsToCardSelectionStoreData,
} from 'common/store-data-to-scan-node-result-converter';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { forOwn, isEmpty } from 'lodash';
import { DictionaryStringTo } from 'types/common-types';
import { StoreNames } from '../../common/stores/store-names';
import {
    CardSelectionData,
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
    LoadAssessmentPayload,
    ToggleActionPayload,
    TransferAssessmentPayload,
} from '../actions/action-payloads';

export class AssessmentCardSelectionStore extends PersistentStore<AssessmentCardSelectionStoreData> {
    private persistedStateFromAssessmentStore: AssessmentCardSelectionStoreData | null;

    constructor(
        private readonly assessmentCardSelectionActions: AssessmentCardSelectionActions,
        private readonly assessmentActions: AssessmentActions,
        private readonly assessmentsProvider: AssessmentsProvider,
        persistedState: AssessmentCardSelectionStoreData,
        assessmentStoreData: AssessmentStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        persistStoreData: boolean,
        indexDBKey: string,
        storeName: StoreNames,
    ) {
        super(storeName, persistedState, idbInstance, indexDBKey, logger, persistStoreData);
        this.persistedStateFromAssessmentStore =
            this.convertAllAssessmentResultsToCardSelectionStoreData(assessmentStoreData);
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
        this.assessmentActions.scanCompleted.addListener(this.onScanCompleted);
        this.assessmentActions.resetData.addListener(this.onResetData);
        this.assessmentActions.resetAllAssessmentsData.addListener(this.onResetAllAssessmentsData);
        this.assessmentActions.loadAssessment.addListener(this.onLoadAssessment);
        this.assessmentActions.loadAssessmentFromTransfer.addListener(
            this.onLoadAssessmentFromTransfer,
        );
    }

    public getDefaultState(): AssessmentCardSelectionStoreData {
        return this.persistedStateFromAssessmentStore ?? this.persistedState ?? {};
    }

    private convertAllAssessmentResultsToCardSelectionStoreData(
        assessmentStoreData: AssessmentStoreData,
    ) {
        if (
            !assessmentStoreData ||
            !assessmentStoreData.assessments ||
            isEmpty(assessmentStoreData.assessments)
        ) {
            return null;
        }

        const assessmentCardSelectionStoreData: AssessmentCardSelectionStoreData = {};

        forOwn(assessmentStoreData.assessments, (assessment, key) => {
            const cardSelectionStoreData: CardSelectionStoreData = assessmentCardSelectionStoreData[
                key
            ] ?? {
                rules: null,
                visualHelperEnabled: false,
                focusedResultUid: null,
            };
            const scanNodeResults = convertAssessmentStoreDataToScanNodeResults(
                assessmentStoreData,
                key,
                cardSelectionStoreData,
            );
            assessmentCardSelectionStoreData[key] = convertResultsToCardSelectionStoreData(
                cardSelectionStoreData,
                scanNodeResults,
            );
        });

        return assessmentCardSelectionStoreData;
    }

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

    private onScanCompleted = async (payload: ScanCompletedPayload<any>) => {
        if (
            !payload ||
            !payload.key ||
            !payload.testType ||
            !payload.scanResult ||
            isEmpty(payload.scanResult.violations) ||
            !payload.selectorMap ||
            isEmpty(payload.selectorMap)
        ) {
            return;
        }

        const assessment = this.assessmentsProvider.forType(payload.testType);
        if (!assessment) {
            return;
        }

        const testKey = assessment.key;
        const ruleId = payload.key;

        if (!this.state[testKey]) {
            this.state[testKey] = {
                rules: null,
                visualHelperEnabled: false,
                focusedResultUid: null,
            };
        }

        if (!this.state[testKey].rules) {
            this.state[testKey].rules = {};
        }

        if (!this.state[testKey].rules![ruleId]) {
            this.state[testKey].rules![ruleId] = {
                cards: {},
                isExpanded: false,
            };
        }

        this.state[testKey].rules![ruleId].cards = this.createCardsFromSelectorMap(
            ruleId,
            payload.selectorMap,
        );

        await this.emitChanged();
    };

    private createCardsFromSelectorMap(
        key: string,
        selectorMap: DictionaryStringTo<HtmlElementAxeResults>,
    ): CardSelectionData {
        const cards: CardSelectionData = {};
        forOwn(selectorMap, result => {
            if (result.ruleResults && result.ruleResults[key] && result.ruleResults[key].id) {
                cards[result.ruleResults[key].id!] = false;
            }
        });
        return cards;
    }

    private onResetAllAssessmentsData = async (): Promise<void> => {
        this.state = {};

        await this.emitChanged();
    };

    private onResetData = async (payload: ToggleActionPayload): Promise<void> => {
        if (!payload || !payload.test) {
            return;
        }

        const assessment = this.assessmentsProvider.forType(payload.test);
        if (!assessment) {
            return;
        }

        const testKey = assessment.key;

        this.state[testKey] = {
            rules: null,
            visualHelperEnabled: false,
            focusedResultUid: null,
        };

        await this.emitChanged();
    };

    private onLoadAssessment = async (payload: LoadAssessmentPayload): Promise<void> => {
        if (
            !payload ||
            !payload.versionedAssessmentData ||
            !payload.versionedAssessmentData.assessmentData
        ) {
            return;
        }

        const assessmentCardSelectionStoreData =
            this.convertAllAssessmentResultsToCardSelectionStoreData(
                payload.versionedAssessmentData.assessmentData,
            );

        if (!assessmentCardSelectionStoreData) {
            return;
        }

        this.state = assessmentCardSelectionStoreData;

        await this.emitChanged();
    };

    private onLoadAssessmentFromTransfer = async (
        payload: TransferAssessmentPayload,
    ): Promise<void> => {
        if (!payload || !payload.assessmentData) {
            return;
        }

        const assessmentCardSelectionStoreData =
            this.convertAllAssessmentResultsToCardSelectionStoreData(payload.assessmentData);

        if (!assessmentCardSelectionStoreData) {
            return;
        }

        this.state = assessmentCardSelectionStoreData;

        await this.emitChanged();
    };
}
