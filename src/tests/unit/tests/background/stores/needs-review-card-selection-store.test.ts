// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewCardSelectionActions } from 'background/actions/needs-review-card-selection-actions';
import { NeedsReviewScanResultActions } from 'background/actions/needs-review-scan-result-actions';
import { TabActions } from 'background/actions/tab-actions';
import { NeedsReviewCardSelectionStore } from 'background/stores/needs-review-card-selection-store';
import {
    ConvertResultsToCardSelectionStoreDataCallback,
    ConvertStoreDataForScanNodeResultsCallback,
} from 'common/store-data-to-scan-node-result-converter';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { NeedsReviewCardSelectionStoreData } from 'common/types/store-data/needs-review-card-selection-store-data';
import { cloneDeep, forOwn } from 'lodash';
import { IMock, Mock, Times } from 'typemoq';

import {
    BaseActionPayload,
    CardSelectionPayload,
    RuleExpandCollapsePayload,
    UnifiedScanCompletedPayload,
} from '../../../../../background/actions/action-payloads';
import { StoreNames } from '../../../../../common/stores/store-names';
import {
    UnifiedResult,
    UnifiedScanResultStoreData,
} from '../../../../../common/types/store-data/unified-data-interface';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('NeedsReviewCardSelectionStore Test', () => {
    let convertResultsToCardSelectionStoreDataCallbackMock: IMock<ConvertResultsToCardSelectionStoreDataCallback>;
    let convertStoreDataForScanNodeResultsCallbackMock: IMock<ConvertStoreDataForScanNodeResultsCallback>;

    beforeEach(() => {
        convertResultsToCardSelectionStoreDataCallbackMock =
            Mock.ofType<ConvertResultsToCardSelectionStoreDataCallback>();
        convertStoreDataForScanNodeResultsCallbackMock =
            Mock.ofType<ConvertStoreDataForScanNodeResultsCallback>();
    });

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

        const callbackExpectedState = {
            rules: {},
            visualHelperEnabled: false,
            focusedResultUid: null,
        } as NeedsReviewCardSelectionStoreData;
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
            createStoreForNeedsReviewScanResultActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        convertResultsToCardSelectionStoreDataCallbackMock.verifyAll();
        convertStoreDataForScanNodeResultsCallbackMock.verifyAll();
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
                new TabActions(),
                null,
                null,
                null,
                null,
                true,
                convertResultsToCardSelectionStoreDataCallbackMock.object,
                convertStoreDataForScanNodeResultsCallbackMock.object,
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

    test('ToggleRuleExpandCollapse expanded', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        expectedState.rules['sampleRuleId1'].isExpanded = true;

        const storeTester = createStoreForNeedsReviewCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetFocusedIdentifier', async () => {
        const payload: BaseActionPayload = {};

        initialState.focusedResultUid = 'some uid';

        const storeTester =
            createStoreForNeedsReviewCardSelectionActions('resetFocusedIdentifier').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester = createStoreForNeedsReviewCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
        };

        const storeTester = createStoreForNeedsReviewCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse no payload', async () => {
        const storeTester = createStoreForNeedsReviewCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(null);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: null,
        };

        const storeTester = createStoreForNeedsReviewCardSelectionActions(
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
            createStoreForNeedsReviewCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection unselected', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester =
            createStoreForNeedsReviewCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection invalid rule', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'invalid-rule-id',
            resultInstanceUid: 'sampleUid1',
        };

        const storeTester =
            createStoreForNeedsReviewCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection invalid card', async () => {
        const payload: CardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'invalid-uid',
        };

        const storeTester =
            createStoreForNeedsReviewCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection  no payload', async () => {
        const storeTester =
            createStoreForNeedsReviewCardSelectionActions('toggleCardSelection').withActionParam(
                null,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', async () => {
        const payload: CardSelectionPayload = {} as CardSelectionPayload;

        const storeTester =
            createStoreForNeedsReviewCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    describe('collapseAllRules', () => {
        test('Does nothing if rules is null', async () => {
            initialState.rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester = createStoreForNeedsReviewCardSelectionActions('collapseAllRules');
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('collapses all expanded rules', async () => {
            expandRuleSelectCards(initialState.rules['sampleRuleId1']);
            expandRuleSelectCards(initialState.rules['sampleRuleId2']);

            const storeTester = createStoreForNeedsReviewCardSelectionActions('collapseAllRules');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('expandAllRules', () => {
        test('Does nothing if rules is null', async () => {
            initialState.rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester = createStoreForNeedsReviewCardSelectionActions('expandAllRules');
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('expands all collapsed rules', async () => {
            initialState.rules['sampleRuleId1'].isExpanded = true;
            initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState.rules['sampleRuleId1'].isExpanded = true;
            expectedState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
            expectedState.rules['sampleRuleId2'].isExpanded = true;

            const storeTester = createStoreForNeedsReviewCardSelectionActions('expandAllRules');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('toggleVisualHelper', () => {
        test('toggle on - no card selection or rule expansion changes', async () => {
            initialState.rules['sampleRuleId1'].isExpanded = true;
            initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState = cloneDeep(initialState);
            expectedState.visualHelperEnabled = true;

            const storeTester = createStoreForNeedsReviewCardSelectionActions('toggleVisualHelper');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('toggle off - cards deselected, no rule expansion changes', async () => {
            initialState.rules['sampleRuleId1'].isExpanded = true;
            initialState.rules['sampleRuleId1'].cards['sampleUid1'] = true;
            initialState.visualHelperEnabled = true;

            expectedState.rules['sampleRuleId1'].isExpanded = true;

            const storeTester = createStoreForNeedsReviewCardSelectionActions('toggleVisualHelper');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('toggle off when rules is null', async () => {
            initialState.rules = null;
            initialState.visualHelperEnabled = true;

            expectedState = cloneDeep(initialState);
            expectedState.visualHelperEnabled = false;

            const storeTester = createStoreForNeedsReviewCardSelectionActions('toggleVisualHelper');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('navigateToNewCardsView', () => {
        beforeEach(() => {
            expectedState.visualHelperEnabled = true;
        });

        it.each([null, {}])(
            'should reset the focused element and turn off visual helper when rules = %s',
            async rules => {
                initialState.focusedResultUid = 'sampleUid1';
                initialState.rules = rules;
                initialState.visualHelperEnabled = true;
                expectedState.focusedResultUid = null;
                expectedState.rules = rules;
                expectedState.visualHelperEnabled = false;

                const storeTester =
                    createStoreForNeedsReviewCardSelectionActions('navigateToNewCardsView');
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

            const storeTester =
                createStoreForNeedsReviewCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', async () => {
            initialState.visualHelperEnabled = false;
            expectedState.visualHelperEnabled = true;

            const storeTester =
                createStoreForNeedsReviewCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', async () => {
            initialState.rules = {};
            initialState.visualHelperEnabled = true;
            expectedState.rules = {};
            expectedState.visualHelperEnabled = false;

            const storeTester =
                createStoreForNeedsReviewCardSelectionActions('navigateToNewCardsView');
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

    function createStoreForNeedsReviewCardSelectionActions(
        actionName: keyof NeedsReviewCardSelectionActions,
    ): StoreTester<NeedsReviewCardSelectionStoreData, NeedsReviewCardSelectionActions> {
        const factory = (actions: NeedsReviewCardSelectionActions) =>
            new NeedsReviewCardSelectionStore(
                actions,
                new NeedsReviewScanResultActions(),
                new TabActions(),
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(NeedsReviewCardSelectionActions, actionName, factory);
    }

    function createStoreForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<NeedsReviewCardSelectionStoreData, TabActions> {
        const factory = (actions: TabActions) =>
            new NeedsReviewCardSelectionStore(
                new NeedsReviewCardSelectionActions(),
                new NeedsReviewScanResultActions(),
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
