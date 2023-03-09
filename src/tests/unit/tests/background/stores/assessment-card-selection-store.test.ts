// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { AssessmentCardSelectionStore } from 'background/stores/assessment-card-selection-store';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { cloneDeep, forOwn } from 'lodash';

import {
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

    function getDefaultState(): AssessmentCardSelectionStoreData {
        return createStoreWithNullParams(AssessmentCardSelectionStore).getDefaultState();
    }
});

describe('AssessmentCardSelectionStore Test', () => {
    let initialState: AssessmentCardSelectionStoreData = null;
    let expectedState: AssessmentCardSelectionStoreData = null;

    beforeEach(() => {
        const defaultState: AssessmentCardSelectionStoreData = {
            testKey1: {
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
            testKey2: {
                rules: {
                    sampleRuleId3: {
                        isExpanded: false,
                        cards: {
                            sampleUid3: false,
                            sampleUid4: false,
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
            testKey: 'testKey1',
        };

        expectedState['testKey1'].rules['sampleRuleId1'].isExpanded = true;

        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onResetFocusedIdentifier', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'testKey1',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState['testKey1'].focusedResultUid = 'some uid';

        const storeTester =
            createStoreForAssessmentCardSelectionActions('resetFocusedIdentifier').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId1',
            testKey: 'testKey1',
        };

        initialState['testKey1'].rules['sampleRuleId1'].isExpanded = true;
        initialState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester = createStoreForAssessmentCardSelectionActions(
            'toggleRuleExpandCollapse',
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', async () => {
        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
            testKey: 'invalid-test-key',
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
            testKey: 'testKey1',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        expectedState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;
        expectedState['testKey1'].focusedResultUid = 'sampleUid1';
        expectedState['testKey1'].visualHelperEnabled = true;

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection unselected', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'testKey1',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'sampleUid1',
        };

        initialState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('toggleCardSelection invalid rule', async () => {
        const payload: AssessmentCardSelectionPayload = {
            testKey: 'testKey1',
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
            testKey: 'testKey1',
            ruleId: 'sampleRuleId1',
            resultInstanceUid: 'invalid-uid',
        };

        const storeTester =
            createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                payload,
            );
        await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('toggleCardSelection no payload', async () => {
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
        const payload: RuleExpandCollapsePayload = {
            testKey: 'testKey1',
            ruleId: 'sampleRuleId1',
        };
        test('Does nothing if rules is null', async () => {
            initialState['testKey1'].rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('collapseAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('collapses all expanded rules', async () => {
            expandRuleSelectCards(initialState['testKey1'].rules['sampleRuleId1']);
            expandRuleSelectCards(initialState['testKey1'].rules['sampleRuleId2']);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('collapseAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('expandAllRules', () => {
        const payload: RuleExpandCollapsePayload = {
            testKey: 'testKey1',
            ruleId: 'sampleRuleId1',
        };
        test('Does nothing if rules is null', async () => {
            initialState['testKey1'].rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        test('expands all collapsed rules', async () => {
            initialState['testKey1'].rules['sampleRuleId1'].isExpanded = true;
            initialState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState['testKey1'].rules['sampleRuleId1'].isExpanded = true;
            expectedState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;
            expectedState['testKey1'].rules['sampleRuleId2'].isExpanded = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('toggleVisualHelper', () => {
        const payload: AssessmentCardSelectionPayload = {
            ruleId: 'sampleRuleId1',
            testKey: 'testKey1',
            resultInstanceUid: '',
        };
        test('toggle on - no card selection or rule expansion changes', async () => {
            initialState['testKey1'].rules['sampleRuleId1'].isExpanded = true;
            initialState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;

            expectedState = cloneDeep(initialState);
            expectedState['testKey1'].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('toggle off - cards deselected, no rule expansion changes', async () => {
            initialState['testKey1'].rules['sampleRuleId1'].isExpanded = true;
            initialState['testKey1'].rules['sampleRuleId1'].cards['sampleUid1'] = true;
            initialState['testKey1'].visualHelperEnabled = true;

            expectedState['testKey1'].rules['sampleRuleId1'].isExpanded = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        test('toggle off when rules is null', async () => {
            initialState['testKey1'].rules = null;
            initialState['testKey1'].visualHelperEnabled = true;

            expectedState = cloneDeep(initialState);
            expectedState['testKey1'].visualHelperEnabled = false;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('navigateToNewCardsView', () => {
        let payload: AssessmentCardSelectionPayload;
        beforeEach(() => {
            expectedState['testKey1'].visualHelperEnabled = true;
            payload = {
                ruleId: 'sampleRuleId1',
                testKey: 'testKey1',
                resultInstanceUid: '',
            };
        });

        it.each([null, {}])(
            'should reset the focused element and turn off visual helper when rules = %s',
            async rules => {
                initialState['testKey1'].focusedResultUid = 'sampleUid1';
                initialState['testKey1'].rules = rules;
                initialState['testKey1'].visualHelperEnabled = true;
                expectedState['testKey1'].focusedResultUid = null;
                expectedState['testKey1'].rules = rules;
                expectedState['testKey1'].visualHelperEnabled = false;

                const storeTester =
                    createStoreForAssessmentCardSelectionActions(
                        'navigateToNewCardsView',
                    ).withActionParam(payload);
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );

        it('should keep all rules/cards/results but set them to collapsed/unselected', async () => {
            initialState['testKey1'].rules = {
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
            expectedState['testKey1'].rules = {
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
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', async () => {
            payload = {
                ruleId: 'sampleRuleId3',
                testKey: 'testKey2',
                resultInstanceUid: '',
            };
            initialState['testKey2'].visualHelperEnabled = false;
            expectedState['testKey2'].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', async () => {
            payload = {
                ruleId: 'sampleRuleId3',
                testKey: 'testKey2',
                resultInstanceUid: '',
            };
            initialState['testKey2'].rules = {};
            initialState['testKey2'].visualHelperEnabled = true;
            expectedState['testKey2'].rules = {};
            expectedState['testKey2'].visualHelperEnabled = false;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
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
            new AssessmentCardSelectionStore(actions, null, null, null, null, true);

        return new StoreTester(AssessmentCardSelectionActions, actionName, factory);
    }
});
