// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentActions } from 'background/actions/assessment-actions';
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { AssessmentCardSelectionStore } from 'background/stores/assessment-card-selection-store';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { cloneDeep, forOwn } from 'lodash';

import {
    BaseActionPayload,
    AssessmentCardSelectionPayload,
    RuleExpandCollapsePayload,
} from '../../../../../background/actions/action-payloads';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('AssessmentCardSelectionStore', () => {
    test('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(AssessmentCardSelectionStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(AssessmentCardSelectionStore);

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.AssessmentCardSelectionStore]);
    });

    test('check defaultState is as expected', () => {
        const defaultState = getDefaultState();

        expect(defaultState.testKey.rules).toBeNull();
    });

    it.each`
        result
        ${'fail'}
        ${'unknown'}
    `('onScanCompleted', async ({ result }) => {
        const initialState = getDefaultState();

        const payload: ScanCompletedPayload<any> = {
            scanResult: [
                {
                    ruleId: 'sampleRuleId',
                    uid: 'sampleUid1',
                    status: result,
                },
                {
                    ruleId: 'sampleRuleId',
                    uid: 'sampleUid2',
                    status: result,
                },
            ],
            rules: [],
        };

        const expectedState: AssessmentCardSelectionStoreData = {
            testKey: {
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
            },
        };

        const storeTester =
            createStoreForAssessmentActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState(): AssessmentCardSelectionStoreData {
        return createStoreWithNullParams(AssessmentCardSelectionStore).getDefaultState();
    }

    function createStoreForAssessmentActions(
        actionName: keyof AssessmentActions,
    ): StoreTester<AssessmentCardSelectionStoreData, AssessmentActions> {
        const factory = (actions: AssessmentActions) =>
            new AssessmentCardSelectionStore(
                new AssessmentCardSelectionActions(),
                actions,
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(AssessmentActions, actionName, factory);
    }
});

describe('AssessmentCardSelectionStore Test', () => {
    let initialState: AssessmentCardSelectionStoreData = null;
    let expectedState: AssessmentCardSelectionStoreData = null;

    beforeEach(() => {
        const defaultState: AssessmentCardSelectionStoreData = {
            testKey: {
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
            },
        };

        initialState = cloneDeep(defaultState);
        expectedState = cloneDeep(defaultState);
    });

    test('ToggleRuleExpandCollapse expanded', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        expectedState.testKey.rules['sampleRuleId1'].isExpanded = true;

        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetFocusedIdentifier', async () => {
        const payload: BaseActionPayload = {};

        initialState.testKey.focusedResultUid = 'some uid';

        const storeTester =
            createStoreForAssessmentCardSelectionActions('resetFocusedIdentifier').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
        };

        initialState.testKey.rules['sampleRuleId1'].isExpanded = true;
        initialState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
        };

        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse no payload', async () => {
        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(null);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: null,
        };

        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection selected', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'sampleTestKey',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        expectedState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;
        expectedState.testKey.focusedResultUid = 'sampleUid1';
        expectedState.testKey.visualHelperEnabled = true;

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection unselected', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'sampleTestKey',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection invalid rule', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'sampleTestKey',
            ruleId: 'invalid-rule-id',
            resultInstanceUid: 'sampleUid1',
        };

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection invalid card', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'sampleTestKey',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'invalid-uid',
        };

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection  no payload', async () => {
        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                null,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', async () => {
        const payload: AssessmentCardSelectionPayload = {} as AssessmentCardSelectionPayload;

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    describe('collapseAllRules', () => {
        test('Does nothing if rules is null', async () => {
            initialState.testKey.rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester = createStoreForAssessmentCardSelectionActions('collapseAllRules');
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('collapses all expanded rules', async () => {
            expandRuleSelectCards(initialState.testKey.rules['sampleRuleId1']);
            expandRuleSelectCards(initialState.testKey.rules['sampleRuleId2']);

            const storeTester = createStoreForAssessmentCardSelectionActions('collapseAllRules');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('expandAllRules', () => {
        test('Does nothing if rules is null', async () => {
            initialState.testKey.rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester = createStoreForAssessmentCardSelectionActions('expandAllRules');
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('expands all collapsed rules', async () => {
            initialState.testKey.rules['sampleRuleId1'].isExpanded = true;
            initialState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState.testKey.rules['sampleRuleId1'].isExpanded = true;
            expectedState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;
            expectedState.testKey.rules['sampleRuleId2'].isExpanded = true;

            const storeTester = createStoreForAssessmentCardSelectionActions('expandAllRules');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('toggleVisualHelper', () => {
        test('toggle on - no card selection or rule expansion changes', async () => {
            initialState.testKey.rules['sampleRuleId1'].isExpanded = true;
            initialState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState = cloneDeep(initialState);
            expectedState.testKey.visualHelperEnabled = true;

            const storeTester = createStoreForAssessmentCardSelectionActions('toggleVisualHelper');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('toggle off - cards deselected, no rule expansion changes', async () => {
            initialState.testKey.rules['sampleRuleId1'].isExpanded = true;
            initialState.testKey.rules['sampleRuleId1'].cards['sampleUid1'] = true;
            initialState.testKey.visualHelperEnabled = true;

            expectedState.testKey.rules['sampleRuleId1'].isExpanded = true;

            const storeTester = createStoreForAssessmentCardSelectionActions('toggleVisualHelper');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('toggle off when rules is null', async () => {
            initialState.testKey.rules = null;
            initialState.testKey.visualHelperEnabled = true;

            expectedState = cloneDeep(initialState);
            expectedState.testKey.visualHelperEnabled = false;

            const storeTester = createStoreForAssessmentCardSelectionActions('toggleVisualHelper');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('navigateToNewCardsView', () => {
        beforeEach(() => {
            expectedState.testKey.visualHelperEnabled = true;
        });

        it.each([null, {}])(
            'should reset the focused element and turn off visual helper when rules = %s',
            async rules => {
                initialState.testKey.focusedResultUid = 'sampleUid1';
                initialState.testKey.rules = rules;
                initialState.testKey.visualHelperEnabled = true;
                expectedState.testKey.focusedResultUid = null;
                expectedState.testKey.rules = rules;
                expectedState.testKey.visualHelperEnabled = false;

                const storeTester =
                    createStoreForAssessmentCardSelectionActions('navigateToNewCardsView');
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );

        it('should keep all rules/cards/results but set them to collapsed/unselected', async () => {
            initialState.testKey.rules = {
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
            expectedState.testKey.rules = {
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
                createStoreForAssessmentCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', async () => {
            initialState.testKey.visualHelperEnabled = false;
            expectedState.testKey.visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', async () => {
            initialState.testKey.rules = {};
            initialState.testKey.visualHelperEnabled = true;
            expectedState.testKey.rules = {};
            expectedState.testKey.visualHelperEnabled = false;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('navigateToNewCardsView');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    function expandRuleSelectCards(rule: RuleExpandCollapseData): void {
        rule.isExpanded = true;

        forOwn(rule.cards, (value, card, cards) => {
            cards[card] = true;
        });
    }

    function createStoreForAssessmentCardSelectionActions(
        actionName: keyof AssessmentCardSelectionActions,
    ): StoreTester<AssessmentCardSelectionStoreData, AssessmentCardSelectionActions> {
        const factory = (actions: AssessmentCardSelectionActions) =>
            new AssessmentCardSelectionStore(
                actions,
                new AssessmentActions(),
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(AssessmentCardSelectionActions, actionName, factory);
    }
});
