// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from 'background/actions/tab-actions';
import {
    ConvertResultsToCardSelectionStoreDataCallback,
    ConvertStoreDataForScanNodeResultsCallback,
} from 'common/store-data-to-scan-node-result-converter';
import { cloneDeep, forOwn } from 'lodash';
import { IMock, Mock, Times } from 'typemoq';

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
import {
    UnifiedResult,
    UnifiedScanResultStoreData,
} from '../../../../../common/types/store-data/unified-data-interface';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('CardSelectionStore Test', () => {
    let convertResultsToCardSelectionStoreDataCallbackMock: IMock<ConvertResultsToCardSelectionStoreDataCallback>;
    let convertStoreDataForScanNodeResultsCallbackMock: IMock<ConvertStoreDataForScanNodeResultsCallback>;

    beforeEach(() => {
        convertResultsToCardSelectionStoreDataCallbackMock =
            Mock.ofType<ConvertResultsToCardSelectionStoreDataCallback>();
        convertStoreDataForScanNodeResultsCallbackMock =
            Mock.ofType<ConvertStoreDataForScanNodeResultsCallback>();
    });

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

        expect(defaultState.rules).toBeNull();
    });

    it.each`
        result
        ${'fail'}
        ${'unknown'}
    `('onScanCompleted', async ({ result }) => {
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

        const callbackExpectedState = {
            rules: {},
            visualHelperEnabled: false,
            focusedResultUid: null,
        } as CardSelectionStoreData;
        const scanResultsNodesStub = [];
        convertStoreDataForScanNodeResultsCallbackMock
            .setup(callback =>
                callback({
                    results: payload.scanResult,
                } as UnifiedScanResultStoreData),
            )
            .returns(() => scanResultsNodesStub)
            .verifiable(Times.once());
        convertResultsToCardSelectionStoreDataCallbackMock
            .setup(callback => callback(callbackExpectedState, scanResultsNodesStub))
            .returns(() => {
                return expectedState;
            })
            .verifiable(Times.once());

        const storeTester =
            createStoreForUnifiedScanResultActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        convertResultsToCardSelectionStoreDataCallbackMock.verifyAll();
        convertStoreDataForScanNodeResultsCallbackMock.verifyAll();
    });

    function getDefaultState(): CardSelectionStoreData {
        return createStoreWithNullParams(CardSelectionStore).getDefaultState();
    }

    function createStoreForUnifiedScanResultActions(
        actionName: keyof UnifiedScanResultActions,
    ): StoreTester<CardSelectionStoreData, UnifiedScanResultActions> {
        const factory = (actions: UnifiedScanResultActions) =>
            new CardSelectionStore(
                new CardSelectionActions(),
                actions,
                new TabActions(),
                null,
                null,
                null,
                null,
                true,
                convertResultsToCardSelectionStoreDataCallbackMock.object,
                convertStoreDataForScanNodeResultsCallbackMock.object,
            );

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

    test('ToggleRuleExpandCollapse expanded', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        expectedState.rules['sampleRuleId1'].isExpanded = true;

        const storeTester = createStoreForCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetFocusedIdentifier', async () => {
        const payload: BaseActionPayload = {};

        initialState.focusedResultUid = 'some uid';

        const storeTester =
            createStoreForCardSelectionActions('resetFocusedIdentifier').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester = createStoreForCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
        };

        const storeTester = createStoreForCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse no payload', async () => {
        const storeTester = createStoreForCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(null);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: null,
        };

        const storeTester = createStoreForCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection selected', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        expectedState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        expectedState.focusedResultUid = 'sampleUid1';
        expectedState.visualHelperEnabled = true;

        const storeTester =
            createStoreForCardSelectionActions('toggleCardSelection').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection unselected', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester =
            createStoreForCardSelectionActions('toggleCardSelection').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection invalid rule', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'invalid-rule-id',
            resultInstanceUid: 'sampleUid1',
        };

        const storeTester =
            createStoreForCardSelectionActions('toggleCardSelection').withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection invalid card', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'invalid-uid',
        };

        const storeTester =
            createStoreForCardSelectionActions('toggleCardSelection').withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection  no payload', async () => {
        const storeTester =
            createStoreForCardSelectionActions('toggleCardSelection').withActionParam(null);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', async () => {
        const payload: CardSelectionPayload = {} as CardSelectionPayload;

        const storeTester =
            createStoreForCardSelectionActions('toggleCardSelection').withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    describe('collapseAllRules', () => {
        it('does nothing if rules is null', async () => {
            initialState.rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester = createStoreForCardSelectionActions('collapseAllRules');
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('collapses all expanded rules', async () => {
            expandRuleSelectCards(initialState.rules['sampleRuleId1']);
            expandRuleSelectCards(initialState.rules['sampleRuleId2']);

            const storeTester = createStoreForCardSelectionActions('collapseAllRules');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('expandAllRules', () => {
        it('does nothing if rules is null', async () => {
            initialState.rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester = createStoreForCardSelectionActions('expandAllRules');
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('expands all collapsed rules', async () => {
            initialState.rules['sampleRuleId1'].isExpanded = true;
            initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState.rules['sampleRuleId1'].isExpanded = true;
            expectedState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
            expectedState.rules['sampleRuleId2'].isExpanded = true;

            const storeTester = createStoreForCardSelectionActions('expandAllRules');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    test('toggleVisualHelper on - no card selection or rule expansion changes', async () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        expectedState = cloneDeep(initialState);
        expectedState.visualHelperEnabled = true;

        const storeTester = createStoreForCardSelectionActions('toggleVisualHelper');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleVisualHelper off - cards deselected, no rule expansion changes', async () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        initialState.visualHelperEnabled = true;

        expectedState.rules['sampleRuleId1'].isExpanded = true;

        const storeTester = createStoreForCardSelectionActions('toggleVisualHelper');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    describe('navigateToNewCardsView', () => {
        beforeEach(() => {
            expectedState.visualHelperEnabled = true;
        });

        it.each([null, {}])(
            'should reset the focused element and turn of visual helper when rules = %s',
            async rules => {
                initialState.focusedResultUid = 'sampleUid1';
                initialState.rules = rules;
                initialState.visualHelperEnabled = true;
                expectedState.focusedResultUid = null;
                expectedState.rules = rules;
                expectedState.visualHelperEnabled = false;

                const storeTester = createStoreForCardSelectionActions('navigateToNewCardsView');
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );

        it('should keep all rules/cards/results but set them to collapsed/unselected', async () => {
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

            const storeTester = createStoreForCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', async () => {
            initialState.visualHelperEnabled = false;
            expectedState.visualHelperEnabled = true;

            const storeTester = createStoreForCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', async () => {
            initialState.rules = {};
            initialState.visualHelperEnabled = true;
            expectedState.rules = {};
            expectedState.visualHelperEnabled = false;

            const storeTester = createStoreForCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    test('reset data on tab URL change', async () => {
        initialState.rules = {};
        initialState.visualHelperEnabled = true;
        expectedState.rules = null;
        expectedState.visualHelperEnabled = false;
        const storeTester = createStoreForTabActions('existingTabUpdated');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
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
            new CardSelectionStore(
                actions,
                new UnifiedScanResultActions(),
                new TabActions(),
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(CardSelectionActions, actionName, factory);
    }

    function createStoreForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<CardSelectionStoreData, TabActions> {
        const factory = (actions: TabActions) =>
            new CardSelectionStore(
                new CardSelectionActions(),
                new UnifiedScanResultActions(),
                actions,
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(TabActions, actionName, factory);
    }
});
