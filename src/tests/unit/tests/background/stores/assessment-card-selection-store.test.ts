// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { AssessmentCardSelectionStore } from 'background/stores/assessment-card-selection-store';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { cloneDeep, forOwn } from 'lodash';

import {
    AssessmentCardSelectionPayload,
    AssessmentCardToggleVisualHelperPayload,
    AssessmentExpandCollapsePayload,
    AssessmentNavigateToNewCardsViewPayload,
    AssessmentResetFocusedIdentifierPayload,
    AssessmentSingleRuleExpandCollapsePayload,
} from '../../../../../background/actions/action-payloads';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('AssessmentCardSelectionStore', () => {
    it('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(AssessmentCardSelectionStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = new AssessmentCardSelectionStore(
            null,
            null,
            null,
            null,
            null,
            null,
            StoreNames.AssessmentCardSelectionStore,
        );

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.AssessmentCardSelectionStore]);
    });

    it('check defaultState is as expected', () => {
        const defaultState = getDefaultState();

        expect(defaultState).toEqual({});
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

    describe('toggleRuleExpandCollapse', () => {
        it('when collapsed, toggles rule to expanded', async () => {
            const payload: AssessmentSingleRuleExpandCollapsePayload = {
                ruleId: 'sampleRuleId1',
                testKey: 'testKey1',
            };

            expectedState['testKey1'].rules['sampleRuleId1'].isExpanded = true;

            const storeTester = createStoreForAssessmentCardSelectionActions(
                'toggleRuleExpandCollapse',
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('when expanded, toggles rule to collapsed', async () => {
            const payload: AssessmentSingleRuleExpandCollapsePayload = {
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

        const testCases = [
            ['invalid testKey', 'invalid-test', 'sampleRuleId1'],
            ['invalid ruleId', 'testKey1', 'invalid-rule-id'],
            ['invalid testKey and ruleId', 'invalid-test', 'invalid-rule-id'],
            ['null testKey', null, 'sampleRuleId1'],
            ['undefined testKey', undefined, 'sampleRuleId1'],
            ['null ruleId', 'testKey1', null],
            ['null testKey and ruleId', null, null],
        ];

        it.each(testCases)('does nothing with payload: %s', async (testName, testKey, ruleId) => {
            const payload: AssessmentSingleRuleExpandCollapsePayload = {
                testKey,
                ruleId,
            };

            const storeTester = createStoreForAssessmentCardSelectionActions(
                'toggleRuleExpandCollapse',
            ).withActionParam(payload);

            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('does nothing with no payload', async () => {
            const storeTester = createStoreForAssessmentCardSelectionActions(
                'toggleRuleExpandCollapse',
            ).withActionParam(null);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    describe('toggleCardSelection', () => {
        it('sets the expected state when a card is selected', async () => {
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

        it('sets the expected state when a card is unselected', async () => {
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

        const testCases = [
            ['invalid testKey', 'invalid-testKey', 'sampleRuleId1', 'sampleUid1'],
            ['invalid ruleId', 'testKey1', 'invalid-rule-id', 'sampleUid1'],
            ['invalid resultInstanceUid', 'testKey1', 'sampleRuleId1', 'invalid-uid'],
        ];

        it.each(testCases)(
            'does nothing with %s in payload',
            async (testName, testKey, ruleId, resultInstanceUid) => {
                const payload: AssessmentCardSelectionPayload = {
                    testKey,
                    ruleId,
                    resultInstanceUid,
                };

                const storeTester =
                    createStoreForAssessmentCardSelectionActions(
                        'toggleCardSelection',
                    ).withActionParam(payload);
                await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
            },
        );

        it('does nothing when there is no payload', async () => {
            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                    null,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    describe('collapseAllRules', () => {
        let payload: AssessmentExpandCollapsePayload;
        beforeEach(() => {
            payload = {
                testKey: 'testKey1',
            };
        });

        it('does nothing if test is null', async () => {
            initialState['testKey1'] = null;
            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('collapseAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('does nothing if invalid testKey', async () => {
            payload.testKey = 'invalid-test';

            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('collapseAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('does nothing if rules is null', async () => {
            initialState['testKey1'].rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('collapseAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('collapses all expanded rules', async () => {
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
        let payload: AssessmentExpandCollapsePayload;
        beforeEach(() => {
            payload = {
                testKey: 'testKey1',
            };
        });

        it('does nothing if test is null', async () => {
            initialState['testKey1'] = null;

            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('does nothing if invalid testKey', async () => {
            payload.testKey = 'invalid-test';

            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('does nothing if rules is null', async () => {
            initialState['testKey1'].rules = null;

            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('expands all collapsed rules', async () => {
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
        const payload: AssessmentCardToggleVisualHelperPayload = {
            testKey: 'testKey1',
        };

        it.each([null, 'invalid-testKey'])(
            'does nothing when payload contains testKey: %s',
            async testKey => {
                const payload: AssessmentCardToggleVisualHelperPayload = {
                    testKey,
                };
                const storeTester =
                    createStoreForAssessmentCardSelectionActions(
                        'toggleVisualHelper',
                    ).withActionParam(payload);
                await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
            },
        );

        it('does nothing when payload is null', async () => {
            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    null,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('toggle on - no card selection or rule expansion changes', async () => {
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

        it('toggle off - cards deselected, no rule expansion changes', async () => {
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

        it('toggle off when rules is null', async () => {
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

    describe('onResetFocusedIdentifier', () => {
        it('does nothing if payload is null', async () => {
            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'resetFocusedIdentifier',
                ).withActionParam(null);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it.each(['invalid-testKey', null])('does nothing if testKey is %s', async testKey => {
            const payload: AssessmentResetFocusedIdentifierPayload = {
                testKey,
            };
            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'resetFocusedIdentifier',
                ).withActionParam(payload);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('sets focusedResultUid for test specified in payload to null', async () => {
            const payload: AssessmentResetFocusedIdentifierPayload = {
                testKey: 'testKey1',
            };

            initialState['testKey1'].focusedResultUid = 'some uid';

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'resetFocusedIdentifier',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('navigateToNewCardsView', () => {
        let payload: AssessmentNavigateToNewCardsViewPayload;
        beforeEach(() => {
            payload = {
                testKey: 'testKey1',
            };
        });

        it('does nothing if payload is null', async () => {
            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(null);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it.each(['invalid-test', null])('does nothing if testKey is: ', async testKey => {
            payload.testKey = testKey;
            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(null);
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
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
            expectedState['testKey1'].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', async () => {
            payload.testKey = 'testKey2';
            initialState['testKey2'].visualHelperEnabled = false;
            expectedState['testKey2'].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', async () => {
            payload.testKey = 'testKey2';
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
            new AssessmentCardSelectionStore(actions, null, null, null, true, '', null);

        return new StoreTester(AssessmentCardSelectionActions, actionName, factory);
    }
});
