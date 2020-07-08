// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep, forOwn } from 'lodash';

import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    UnifiedScanCompletedPayload,
} from '../../../../../background/actions/action-payloads';
import { CardSelectionActions } from '../../../../../background/actions/card-selection-actions';
import { UnifiedScanResultActions } from '../../../../../background/actions/unified-scan-result-actions';
import { CardSelectionStore } from '../../../../../background/stores/card-selection-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import {
    CardSelectionStoreData,
    RuleExpandCollapseData,
} from '../../../../../common/types/store-data/card-selection-store-data';
import { UnifiedResult } from '../../../../../common/types/store-data/unified-data-interface';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('CardSelectionStore Test', () => {
    test('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(CardSelectionStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(CardSelectionStore);

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.CardSelectionStore]);
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

        const expectedState: CardSelectionStoreData = {
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

        createStoreForUnifiedScanResultActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState(): CardSelectionStoreData {
        return createStoreWithNullParams(CardSelectionStore).getDefaultState();
    }

    function createStoreForUnifiedScanResultActions(
        actionName: keyof UnifiedScanResultActions,
    ): StoreTester<CardSelectionStoreData, UnifiedScanResultActions> {
        const factory = (actions: UnifiedScanResultActions) =>
            new CardSelectionStore(new CardSelectionActions(), actions);

        return new StoreTester(UnifiedScanResultActions, actionName, factory);
    }
});

describe('CardSelectionStore Test', () => {
    let initialState: CardSelectionStoreData = null;
    let expectedState: CardSelectionStoreData = null;

    beforeEach(() => {
        const defaultState: CardSelectionStoreData = {
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

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetFocusedIdentifier', () => {
        const payload: BaseActionPayload = {};

        initialState.focusedResultUid = 'some uid';

        createStoreForCardSelectionActions('resetFocusedIdentifier')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
        };

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse no payload', () => {
        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(null)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: null,
        };

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
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

        createStoreForCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection unselected', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        createStoreForCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection invalid rule', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'invalid-rule-id',
            resultInstanceUid: 'sampleUid1',
        };

        createStoreForCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection invalid card', () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'invalid-uid',
        };

        createStoreForCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection  no payload', () => {
        createStoreForCardSelectionActions('toggleCardSelection')
            .withActionParam(null)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', () => {
        const payload: CardSelectionPayload = {} as CardSelectionPayload;

        createStoreForCardSelectionActions('toggleCardSelection')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('CollapseAllRules', () => {
        expandRuleSelectCards(initialState.rules['sampleRuleId1']);
        expandRuleSelectCards(initialState.rules['sampleRuleId2']);

        createStoreForCardSelectionActions('collapseAllRules').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test('expandAllRules', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        expectedState.rules['sampleRuleId1'].isExpanded = true;
        expectedState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        expectedState.rules['sampleRuleId2'].isExpanded = true;

        createStoreForCardSelectionActions('expandAllRules').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test('toggleVisualHelper on - no card selection or rule expansion changes', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        expectedState = cloneDeep(initialState);
        expectedState.visualHelperEnabled = true;

        createStoreForCardSelectionActions('toggleVisualHelper').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test('toggleVisualHelper off - cards deselected, no rule expansion changes', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        initialState.visualHelperEnabled = true;

        expectedState.rules['sampleRuleId1'].isExpanded = true;

        createStoreForCardSelectionActions('toggleVisualHelper').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    function expandRuleSelectCards(rule: RuleExpandCollapseData): void {
        rule.isExpanded = true;

        forOwn(rule.cards, (value, card, cards) => {
            cards[card] = true;
        });
    }

    function createStoreForCardSelectionActions(
        actionName: keyof CardSelectionActions,
    ): StoreTester<CardSelectionStoreData, CardSelectionActions> {
        const factory = (actions: CardSelectionActions) =>
            new CardSelectionStore(actions, new UnifiedScanResultActions());

        return new StoreTester(CardSelectionActions, actionName, factory);
    }
});
