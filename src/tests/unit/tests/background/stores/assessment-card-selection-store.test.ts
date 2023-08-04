// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentActions } from 'background/actions/assessment-actions';
import { AssessmentCardSelectionActions } from 'background/actions/assessment-card-selection-actions';
import { InitialAssessmentStoreDataGenerator } from 'background/initial-assessment-store-data-generator';
import { AssessmentCardSelectionStore } from 'background/stores/assessment-card-selection-store';
import { AssessmentCardSelectionStoreData } from 'common/types/store-data/assessment-card-selection-store-data';
import {
    AssessmentNavState,
    AssessmentStoreData,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { RuleExpandCollapseData } from 'common/types/store-data/card-selection-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import {
    DecoratedAxeNodeResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { ScanCompletedPayload } from 'injected/analyzers/analyzer';
import { cloneDeep, forOwn } from 'lodash';
import { RuleResult, ScanResults } from 'scanner/iruleresults';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

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
} from '../../../../../background/actions/action-payloads';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('AssessmentCardSelectionStore', () => {
    let testObject;
    beforeEach(() => {
        testObject = createStoreWithNullParams(AssessmentCardSelectionStore);
    });
    it('constructor has no side effects', () => {
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
            null,
            null,
            null,
            StoreNames.AssessmentCardSelectionStore,
        );

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.AssessmentCardSelectionStore]);
    });
});

describe('AssessmentCardSelectionStore Test', () => {
    const stubRuleId1 = 'sampleRuleId1';
    const stubRuleId2 = 'sampleRuleId2';
    const stubRuleId3 = 'sampleRuleId3';
    const stubTestKey1 = 'testKey1';
    const stubTestKey2 = 'testKey2';
    const stubUid1 = 'sampleUid1';
    const stubUid2 = 'sampleUid2';
    const stubUid3 = 'sampleUid3';
    const stubUid4 = 'sampleUid4';
    let initialState: AssessmentCardSelectionStoreData = null;
    let expectedState: AssessmentCardSelectionStoreData = null;
    let initialAssessmentStoreDataGeneratorMock: IMock<InitialAssessmentStoreDataGenerator>;

    beforeEach(() => {
        const defaultState: AssessmentCardSelectionStoreData = {
            [stubTestKey1]: {
                rules: {
                    [stubRuleId1]: {
                        isExpanded: false,
                        cards: {
                            [stubUid1]: false,
                            [stubUid2]: false,
                        },
                    },
                    [stubRuleId2]: {
                        isExpanded: false,
                        cards: {
                            [stubUid1]: false,
                            [stubUid2]: false,
                        },
                    },
                },
                visualHelperEnabled: false,
                focusedResultUid: null,
            },
            [stubTestKey2]: {
                rules: {
                    [stubRuleId3]: {
                        isExpanded: false,
                        cards: {
                            [stubUid3]: false,
                            [stubUid4]: false,
                        },
                    },
                },
                visualHelperEnabled: false,
                focusedResultUid: null,
            },
        };

        initialState = cloneDeep(defaultState);
        expectedState = cloneDeep(defaultState);

        initialAssessmentStoreDataGeneratorMock =
            Mock.ofType<InitialAssessmentStoreDataGenerator>();
    });

    describe('getDefaultState', () => {
        it('returns store state data based on persisted state', () => {
            const testObject = new AssessmentCardSelectionStore(
                new AssessmentCardSelectionActions(),
                new AssessmentActions(),
                null,
                initialState,
                null,
                initialAssessmentStoreDataGeneratorMock.object,
                null,
                null,
                '',
                null,
            );

            expect(testObject.getDefaultState()).toEqual(expectedState);
        });

        it('returns store state data based on persisted assessment state if no persisted store state', () => {
            const assessmentStoreState: AssessmentStoreData = createAssessmentStoreDataWithStatus(
                ManualTestStatus.FAIL,
            );
            const testObject = new AssessmentCardSelectionStore(
                new AssessmentCardSelectionActions(),
                new AssessmentActions(),
                null,
                null,
                assessmentStoreState,
                initialAssessmentStoreDataGeneratorMock.object,
                null,
                null,
                '',
                null,
            );
            setupDataGeneratorMock(assessmentStoreState, assessmentStoreState);

            expect(testObject.getDefaultState()).toEqual(expectedState);
            initialAssessmentStoreDataGeneratorMock.verifyAll();
        });
    });

    describe('toggleRuleExpandCollapse', () => {
        it('when collapsed, toggles rule to expanded', async () => {
            const payload: AssessmentSingleRuleExpandCollapsePayload = {
                ruleId: stubRuleId1,
                testKey: stubTestKey1,
            };

            expectedState[stubTestKey1].rules[stubRuleId1].isExpanded = true;

            const storeTester = createStoreForAssessmentCardSelectionActions(
                'toggleRuleExpandCollapse',
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('when expanded, toggles rule to collapsed', async () => {
            const payload: AssessmentSingleRuleExpandCollapsePayload = {
                ruleId: stubRuleId1,
                testKey: stubTestKey1,
            };

            initialState[stubTestKey1].rules[stubRuleId1].isExpanded = true;
            initialState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;

            const storeTester = createStoreForAssessmentCardSelectionActions(
                'toggleRuleExpandCollapse',
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        const testCases = [
            ['invalid testKey', 'invalid-test', stubRuleId1],
            ['invalid ruleId', stubTestKey1, 'invalid-rule-id'],
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
                testKey: stubTestKey1,
                ruleId: stubRuleId1,
                resultInstanceUid: stubUid1,
            };

            expectedState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;
            expectedState[stubTestKey1].focusedResultUid = stubUid1;
            expectedState[stubTestKey1].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('sets the expected state when a card is unselected', async () => {
            const payload: AssessmentCardSelectionPayload = {
                testKey: stubTestKey1,
                ruleId: stubRuleId1,
                resultInstanceUid: stubUid1,
            };

            initialState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleCardSelection').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        const testCases = [
            ['invalid testKey', 'invalid-testKey', stubRuleId1, stubUid1],
            ['invalid ruleId', stubTestKey1, 'invalid-rule-id', stubUid1],
            ['invalid resultInstanceUid', stubTestKey1, stubRuleId1, 'invalid-uid'],
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
                testKey: stubTestKey1,
            };
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
            initialState[stubTestKey1].rules = null;
            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('collapseAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('collapses all expanded rules', async () => {
            expandRuleSelectCards(initialState[stubTestKey1].rules[stubRuleId1]);
            expandRuleSelectCards(initialState[stubTestKey1].rules[stubRuleId2]);

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
                testKey: stubTestKey1,
            };
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
            initialState[stubTestKey1].rules = null;

            expectedState = cloneDeep(initialState);

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('expands all collapsed rules', async () => {
            initialState[stubTestKey1].rules[stubRuleId1].isExpanded = true;
            initialState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;

            expectedState[stubTestKey1].rules[stubRuleId1].isExpanded = true;
            expectedState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;
            expectedState[stubTestKey1].rules[stubRuleId2].isExpanded = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('expandAllRules').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('toggleVisualHelper', () => {
        const payload: AssessmentCardToggleVisualHelperPayload = {
            testKey: stubTestKey1,
        };

        it('toggle on - no card selection or rule expansion changes', async () => {
            initialState[stubTestKey1].rules[stubRuleId1].isExpanded = true;
            initialState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;

            expectedState = cloneDeep(initialState);
            expectedState[stubTestKey1].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('toggle off - cards deselected, no rule expansion changes', async () => {
            initialState[stubTestKey1].rules[stubRuleId1].isExpanded = true;
            initialState[stubTestKey1].rules[stubRuleId1].cards[stubUid1] = true;
            initialState[stubTestKey1].visualHelperEnabled = true;

            expectedState[stubTestKey1].rules[stubRuleId1].isExpanded = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('toggle off when rules is null', async () => {
            initialState[stubTestKey1].rules = null;
            initialState[stubTestKey1].visualHelperEnabled = true;

            expectedState = cloneDeep(initialState);
            expectedState[stubTestKey1].visualHelperEnabled = false;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('toggle off when rule is null', async () => {
            initialState[stubTestKey1].rules[stubRuleId1] = null;
            initialState[stubTestKey1].rules[stubRuleId2] = null;
            initialState[stubTestKey2].rules[stubRuleId3] = null;
            initialState[stubTestKey1].visualHelperEnabled = true;

            expectedState = cloneDeep(initialState);
            expectedState[stubTestKey1].visualHelperEnabled = false;

            const storeTester =
                createStoreForAssessmentCardSelectionActions('toggleVisualHelper').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('onResetFocusedIdentifier', () => {
        it('sets focusedResultUid for test specified in payload to null', async () => {
            const payload: AssessmentResetFocusedIdentifierPayload = {
                testKey: stubTestKey1,
            };

            initialState[stubTestKey1].focusedResultUid = 'some uid';

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
                testKey: stubTestKey1,
            };
        });

        it.each([null, {}])(
            'should reset the focused element and turn off visual helper when rules = %s',
            async rules => {
                initialState[stubTestKey1].focusedResultUid = stubUid1;
                initialState[stubTestKey1].rules = rules;
                initialState[stubTestKey1].visualHelperEnabled = true;

                expectedState[stubTestKey1].focusedResultUid = null;
                expectedState[stubTestKey1].rules = rules;
                expectedState[stubTestKey1].visualHelperEnabled = false;

                const storeTester =
                    createStoreForAssessmentCardSelectionActions(
                        'navigateToNewCardsView',
                    ).withActionParam(payload);
                await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            },
        );

        it('should keep all rules/cards/results but set them to collapsed/unselected', async () => {
            initialState[stubTestKey1].rules = {
                [stubRuleId1]: {
                    isExpanded: true,
                    cards: {
                        [stubUid1]: true,
                        [stubUid2]: false,
                    },
                },
                [stubRuleId2]: {
                    isExpanded: false,
                    cards: {
                        [stubUid1]: false,
                        [stubUid2]: false,
                    },
                },
            };
            expectedState[stubTestKey1].rules = {
                [stubRuleId1]: {
                    isExpanded: false,
                    cards: {
                        [stubUid1]: false,
                        [stubUid2]: false,
                    },
                },
                [stubRuleId2]: {
                    isExpanded: false,
                    cards: {
                        [stubUid1]: false,
                        [stubUid2]: false,
                    },
                },
            };
            expectedState[stubTestKey1].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to enabled if there are any rules', async () => {
            payload.testKey = stubTestKey2;
            initialState[stubTestKey2].visualHelperEnabled = false;
            expectedState[stubTestKey2].visualHelperEnabled = true;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('should set the visualHelperToggle to disabled if there are no rules', async () => {
            payload.testKey = stubTestKey2;
            initialState[stubTestKey2].rules = {};
            initialState[stubTestKey2].visualHelperEnabled = true;
            expectedState[stubTestKey2].rules = {};
            expectedState[stubTestKey2].visualHelperEnabled = false;

            const storeTester =
                createStoreForAssessmentCardSelectionActions(
                    'navigateToNewCardsView',
                ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('onScanCompleted', () => {
        const stubSelectorMap = {
            sampleSelector1: {
                ruleResults: {
                    [stubRuleId1]: {
                        id: stubUid1,
                    } as DecoratedAxeNodeResult,
                },
                target: [],
            },
            sampleSelector2: {
                ruleResults: {
                    [stubRuleId1]: {
                        id: stubUid2,
                    } as DecoratedAxeNodeResult,
                },
                target: [],
            },
        } as DictionaryStringTo<HtmlElementAxeResults>;
        const stubScanResult = {
            violations: [{ instanceId: stubUid1 }] as unknown as RuleResult[],
        } as ScanResults;

        const payload: ScanCompletedPayload<any> = {
            key: stubRuleId1,
            testType: stubTestKey1 as unknown as VisualizationType,
            selectorMap: stubSelectorMap,
            scanResult: stubScanResult,
            scanIncompleteWarnings: [],
        };

        let assessmentsProviderMock: IMock<AssessmentsProvider>;

        beforeEach(() => {
            assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(
                undefined,
                MockBehavior.Strict,
            );
        });

        it('does nothing when there is no assessment for the test in payload', async () => {
            assessmentsProviderMock.setup(apm => apm.forType(It.isAny())).returns(() => undefined);

            const storeTester = createStoreForAssessmentActions(
                'scanCompleted',
                assessmentsProviderMock.object,
            ).withActionParam(payload);

            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('sets the state based on the ScanCompletedPayload', async () => {
            const stubAssessment: Assessment = {
                key: stubTestKey1,
            } as Assessment;
            const assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(
                undefined,
                MockBehavior.Strict,
            );
            assessmentsProviderMock
                .setup(apm => apm.forType(It.isAny()))
                .returns(() => stubAssessment);

            initialState = {};
            expectedState = {
                [stubTestKey1]: {
                    rules: {
                        [stubRuleId1]: {
                            isExpanded: false,
                            cards: {
                                [stubUid1]: false,
                                [stubUid2]: false,
                            },
                        },
                    },
                    visualHelperEnabled: false,
                    focusedResultUid: null,
                },
            };

            const storeTester = createStoreForAssessmentActions(
                'scanCompleted',
                assessmentsProviderMock.object,
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('onResetAllAssessmentsData', () => {
        it('resets store data to default', async () => {
            expectedState = {};

            const storeTester = createStoreForAssessmentActions('resetAllAssessmentsData');
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('onResetData', () => {
        const payload: ToggleActionPayload = {
            test: stubTestKey1 as unknown as VisualizationType,
        };
        let assessmentsProviderMock: IMock<AssessmentsProvider>;

        beforeEach(() => {
            assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(
                undefined,
                MockBehavior.Strict,
            );
        });

        it('does nothing when there is no assessment for the test in payload', async () => {
            assessmentsProviderMock.setup(apm => apm.forType(It.isAny())).returns(() => undefined);

            const storeTester = createStoreForAssessmentActions(
                'resetData',
                assessmentsProviderMock.object,
            ).withActionParam(payload);

            await storeTester.testListenerToNeverBeCalled(initialState, expectedState);
        });

        it('resets data for specified key in payload', async () => {
            const stubAssessment: Assessment = {
                key: stubTestKey1,
            } as Assessment;

            assessmentsProviderMock
                .setup(apm => apm.forType(It.isAny()))
                .returns(() => stubAssessment);

            expectedState[stubTestKey1] = {
                rules: null,
                visualHelperEnabled: false,
                focusedResultUid: null,
            };

            const storeTester = createStoreForAssessmentActions(
                'resetData',
                assessmentsProviderMock.object,
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
        });
    });

    describe('onLoadAssessment', () => {
        it('loads assessment from assessment data in payload', async () => {
            const assessmentData = createAssessmentStoreDataWithStatus(ManualTestStatus.FAIL);
            initialState = {};
            const payload: LoadAssessmentPayload = {
                versionedAssessmentData: {
                    version: 1,
                    assessmentData,
                },
                tabId: -1,
                detailsViewId: 'stub-details-view-id',
            };
            setupDataGeneratorMock(assessmentData, assessmentData);

            const storeTester =
                createStoreForAssessmentActions('loadAssessment').withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            initialAssessmentStoreDataGeneratorMock.verifyAll();
        });
    });

    describe('onLoadAssessmentFromTransfer', () => {
        it('loads assessment from assessment data in payload', async () => {
            const assessmentData = createAssessmentStoreDataWithStatus(ManualTestStatus.FAIL);
            initialState = {};
            const payload: TransferAssessmentPayload = {
                assessmentData,
            };
            setupDataGeneratorMock(assessmentData, assessmentData);

            const storeTester = createStoreForAssessmentActions(
                'loadAssessmentFromTransfer',
            ).withActionParam(payload);
            await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
            initialAssessmentStoreDataGeneratorMock.verifyAll();
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
                initialAssessmentStoreDataGeneratorMock.object,
                null,
                null,
                '',
                null,
            );

        return new StoreTester(AssessmentCardSelectionActions, actionName, factory);
    }

    function createStoreForAssessmentActions(
        actionName: keyof AssessmentActions,
        assessmentsProvider?: AssessmentsProvider,
    ): StoreTester<AssessmentCardSelectionStoreData, AssessmentActions> {
        const factory = (actions: AssessmentActions) =>
            new AssessmentCardSelectionStore(
                new AssessmentCardSelectionActions(),
                actions,
                assessmentsProvider ?? CreateTestAssessmentProvider(),
                null,
                null,
                initialAssessmentStoreDataGeneratorMock.object,
                null,
                null,
                '',
                null,
            );

        return new StoreTester(AssessmentActions, actionName, factory);
    }

    function setupDataGeneratorMock(
        persistedData: AssessmentStoreData,
        initialData: AssessmentStoreData,
        times: Times = Times.once(),
    ): void {
        initialAssessmentStoreDataGeneratorMock
            .setup(im => im.generateInitialState(persistedData))
            .returns(() => initialData)
            .verifiable(times);
    }

    const testStepResult = (uid: string, status: ManualTestStatus): TestStepResult => {
        return {
            id: uid,
            status,
            isCapturedByUser: false,
            isVisualizationSupported: true,
            isVisualizationEnabled: false,
            isVisible: true,
        } as TestStepResult;
    };

    function createAssessmentStoreDataWithStatus(status: ManualTestStatus): AssessmentStoreData {
        return {
            persistedTabInfo: {},
            assessments: {
                [stubTestKey1]: {
                    fullAxeResultsMap: {},
                    generatedAssessmentInstancesMap: {
                        selector1: {
                            target: ['selector1'],
                            html: 'html1',
                            testStepResults: {
                                [stubRuleId1]: testStepResult(stubUid1, status),
                                [stubRuleId2]: testStepResult(stubUid1, status),
                            },
                            propertyBag: null,
                        },
                        selector2: {
                            target: ['selector2'],
                            html: 'html2',
                            testStepResults: {
                                [stubRuleId1]: testStepResult(stubUid2, status),
                                [stubRuleId2]: testStepResult(stubUid2, status),
                            },
                            propertyBag: null,
                        },
                    },
                    testStepStatus: {},
                },
                [stubTestKey2]: {
                    fullAxeResultsMap: {},
                    generatedAssessmentInstancesMap: {
                        selector2: {
                            target: ['selector2'],
                            html: 'html1',
                            testStepResults: {
                                [stubRuleId3]: testStepResult(stubUid3, status),
                            },
                            propertyBag: null,
                        },
                        selector3: {
                            target: ['selector3'],
                            html: 'html2',
                            testStepResults: {
                                [stubRuleId3]: testStepResult(stubUid4, status),
                            },
                            propertyBag: null,
                        },
                    },
                    testStepStatus: {},
                },
            },
            assessmentNavState: {} as AssessmentNavState,
            resultDescription: '',
        };
    }
});
