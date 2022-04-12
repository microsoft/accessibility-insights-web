// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewCardSelectionActions } from 'background/actions/needs-review-card-selection-actions';
import { NeedsReviewScanResultActions } from 'background/actions/needs-review-scan-result-actions';
import { NeedsReviewCardSelectionStore } from 'background/stores/needs-review-card-selection-store';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { cloneDeep, forOwn } from 'lodash';

import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    UnifiedScanCompletedPayload,
} from '../../../../../background/actions/action-payloads';
import { StoreNames } from '../../../../../common/stores/store-names';
import { UnifiedResult } from '../../../../../common/types/store-data/unified-data-interface';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('NeedsReviewCardSelectionStore Test', () => {
    test('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(NeedsReviewCardSelectionStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(NeedsReviewCardSelectionStore);

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.NeedsReviewCardSelectionStore]);
    });

    test('check defaultState is as expected', () => {
        const defaultState = getDefaultState();

        expect(defaultState.rules).toBeDefined();
    });

    it.each`
        result
        ${'fail'}
        ${'unknown'}
    `('onScanCompleted', ({ result }) => {
        const initialState = getDefaultState();

        const payload: UnifiedScanCompletedPayload = {
            scanResult: [
                {
                    ruleId: 'sampleRuleId',
                    uid: 'sampleUid1',
                    status: result,
                } as UnifiedResult,
                {
                    ruleId: 'sampleRuleId',
                    uid: 'sampleUid2',
                    status: result,
                } as UnifiedResult,
            ],
            rules: [],
        } as UnifiedScanCompletedPayload;

        const expectedState: NeedsReviewCardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: false,
                    cards: {
                        sampleUid1: false,
                        sampleUid2: false,
                    },
                },
            },
            focusedResultUid: null,
            visualHelperEnabled: true,
        };

        createStoreForNeedsReviewScanResultActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState(): NeedsReviewCardSelectionStoreData {
        return createStoreWithNullParams(NeedsReviewCardSelectionStore).getDefaultState();
    }

    function createStoreForNeedsReviewScanResultActions(
        actionName: keyof NeedsReviewScanResultActions,
    ): StoreTester<NeedsReviewCardSelectionStoreData, NeedsReviewScanResultActions> {
        const factory = (actions: NeedsReviewScanResultActions) =>
            new NeedsReviewCardSelectionStore(
                new NeedsReviewCardSelectionActions(),
                actions,
                null,
                null,
                null,
            );

        return new StoreTester(NeedsReviewScanResultActions, actionName, factory);
    }
});

describe('NeedsReviewCardSelectionStore Test', () => {
    let initialState: NeedsReviewCardSelectionStoreData = null;
    let expectedState: NeedsReviewCardSelectionStoreData = null;

    beforeEach(() => {
        const defaultState: NeedsReviewCardSelectionStoreData = {
            rules: {
                sampleRuleId1: {
                    isExpanded: false,
                    cards: {
                        sampleUid1: false,
                        sampleUid2: false,
                    },
                },
                sampleRuleId2: {
                    isExpanded: false,
                    cards: {
                        sampleUid1: false,
                        sampleUid2: false,
                    },
                },
            },
            visualHelperEnabled: false,
            focusedResultUid: null,
        };

        initialState = cloneDeep(defaultState);
        expectedState = cloneDeep(defaultState);
    });

    test('ToggleRuleExpandCollapse expanded', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        expectedState.rules['sampleRuleId1'].isExpanded = true;

        createStoreForNeedsReviewCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetFocusedIdentifier', () => {
        const payload: BaseActionPayload = {};

        initialState.focusedResultUid = 'some uid';

        createStoreForNeedsReviewCardSelectionActions('resetFocusedIdentifier')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        createStoreForNeedsReviewCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
        };

        createStoreForNeedsReviewCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse no payload', () => {
        createStoreForNeedsReviewCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(null)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: null,
        };

        createStoreForNeedsReviewCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection selected', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        expectedState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        expectedState.focusedResultUid = 'sampleUid1';
        expectedState.visualHelperEnabled = true;

        createStoreForNeedsReviewCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection unselected', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        createStoreForNeedsReviewCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection invalid rule', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'invalid-rule-id',
            resultInstanceUid: 'sampleUid1',
        };

        createStoreForNeedsReviewCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection invalid card', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'invalid-uid',
        };

        createStoreForNeedsReviewCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection  no payload', () => {
        createStoreForNeedsReviewCardSelectionActions('toggleCardSelection')
            .withActionParam(null)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', () => {
        const payload: CardSelectionPayload = {} as CardSelectionPayload;

        createStoreForNeedsReviewCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('CollapseAllRules', () => {
        expandRuleSelectCards(initialState.rules['sampleRuleId1']);
        expandRuleSelectCards(initialState.rules['sampleRuleId2']);

        createStoreForNeedsReviewCardSelectionActions(
            'collapseAllRules',
        ).testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('expandAllRules', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        expectedState.rules['sampleRuleId1'].isExpanded = true;
        expectedState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        expectedState.rules['sampleRuleId2'].isExpanded = true;

        createStoreForNeedsReviewCardSelectionActions('expandAllRules').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test('toggleVisualHelper on - no card selection or rule expansion changes', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        expectedState = cloneDeep(initialState);
        expectedState.visualHelperEnabled = true;

        createStoreForNeedsReviewCardSelectionActions(
            'toggleVisualHelper',
        ).testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleVisualHelper off - cards deselected, no rule expansion changes', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        initialState.visualHelperEnabled = true;

        expectedState.rules['sampleRuleId1'].isExpanded = true;

        createStoreForNeedsReviewCardSelectionActions(
            'toggleVisualHelper',
        ).testListenerToBeCalledOnce(initialState, expectedState);
    });

    describe('navigateToNewCardsView', () => {
        beforeEach(() => {
            expectedState.visualHelperEnabled = true;
        });

        it('should reset the focused element', () => {
            initialState.focusedResultUid = 'sampleUid1';
            expectedState.focusedResultUid = null;

            createStoreForNeedsReviewCardSelectionActions(
                'navigateToNewCardsView',
            ).testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should keep all rules/cards/results but set them to collapsed/unselected', () => {
            initialState.rules = {
                sampleRuleId1: {
                    isExpanded: true,
                    cards: {
                        sampleUid1: true,
                        sampleUid2: false,
                    },
                },
                sampleRuleId2: {
                    isExpanded: false,
                    cards: {
                        sampleUid1: false,
                        sampleUid2: false,
                    },
                },
            };
            expectedState.rules = {
                sampleRuleId1: {
                    isExpanded: false,
                    cards: {
                        sampleUid1: false,
                        sampleUid2: false,
                    },
                },
                sampleRuleId2: {
                    isExpanded: false,
                    cards: {
                        sampleUid1: false,
                        sampleUid2: false,
                    },
                },
            };

            createStoreForNeedsReviewCardSelectionActions(
                'navigateToNewCardsView',
            ).testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', () => {
            initialState.visualHelperEnabled = false;
            expectedState.visualHelperEnabled = true;

            createStoreForNeedsReviewCardSelectionActions(
                'navigateToNewCardsView',
            ).testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', () => {
            initialState.rules = {};
            initialState.visualHelperEnabled = true;
            expectedState.rules = {};
            expectedState.visualHelperEnabled = false;

            createStoreForNeedsReviewCardSelectionActions(
                'navigateToNewCardsView',
            ).testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    function expandRuleSelectCards(rule: RuleExpandCollapseData): void {
        rule.isExpanded = true;

        forOwn(rule.cards, (value, card, cards) => {
            cards[card] = true;
        });
    }

    function createStoreForNeedsReviewCardSelectionActions(
        actionName: keyof NeedsReviewCardSelectionActions,
    ): StoreTester<NeedsReviewCardSelectionStoreData, NeedsReviewCardSelectionActions> {
        const factory = (actions: NeedsReviewCardSelectionActions) =>
            new NeedsReviewCardSelectionStore(
                actions,
                new NeedsReviewScanResultActions(),
                null,
                null,
                null,
            );

        return new StoreTester(NeedsReviewCardSelectionActions, actionName, factory);
    }
});
