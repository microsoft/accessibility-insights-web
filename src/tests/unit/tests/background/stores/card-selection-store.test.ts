// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleExpandCollapsePayload, UnifiedScanCompletedPayload } from '../../../../../background/actions/action-payloads';
import { CardSelectionActions } from '../../../../../background/actions/card-selection-actions';
import { UnifiedScanResultActions } from '../../../../../background/actions/unified-scan-result-actions';
import { CardSelectionStore } from '../../../../../background/stores/card-selection-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import { CardSelectionStoreData } from '../../../../../common/types/store-data/card-selection-store-data';
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

    test('onScanCompleted', () => {
        const initialState = getDefaultState();

        const payload: UnifiedScanCompletedPayload = {
            scanResult: [
                {
                    ruleId: 'sampleRuleId',
                    uid: 'sampleUid',
                    status: 'fail',
                } as UnifiedResult,
            ],
            rules: [],
        } as UnifiedScanCompletedPayload;

        const expectedState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: false,
                    cards: {
                        sampleUid: false,
                    },
                },
            },
        };

        createStoreForUnifiedScanResultActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse expanded', () => {
        const initialState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: false,
                    cards: {
                        sampleUid: false,
                    },
                },
            },
        };

        const expectedState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: true,
                    cards: {
                        sampleUid: false,
                    },
                },
            },
        };

        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId',
        };

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse collapsed', () => {
        const initialState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: true,
                    cards: {
                        sampleUid: true,
                    },
                },
            },
        };

        const expectedState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: false,
                    cards: {
                        sampleUid: false,
                    },
                },
            },
        };

        const payload: RuleExpandCollapsePayload = {
            ruleId: 'sampleRuleId',
        };

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid rule', () => {
        const initialState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: true,
                    cards: {
                        sampleUid: true,
                    },
                },
            },
        };

        const expectedState = initialState;

        const payload: RuleExpandCollapsePayload = {
            ruleId: 'invalid-rule-id',
        };

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse no payload', () => {
        const initialState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: true,
                    cards: {
                        sampleUid: true,
                    },
                },
            },
        };

        const expectedState = initialState;

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(null)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('ToggleRuleExpandCollapse invalid payload', () => {
        const initialState: CardSelectionStoreData = {
            rules: {
                sampleRuleId: {
                    isExpanded: true,
                    cards: {
                        sampleUid: true,
                    },
                },
            },
        };

        const expectedState = initialState;

        const payload: RuleExpandCollapsePayload = {
            ruleId: null,
        };

        createStoreForCardSelectionActions('toggleRuleExpandCollapse')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('CollapseAllRules', () => {
        const initialState: CardSelectionStoreData = {
            rules: {
                sampleRuleId1: {
                    isExpanded: true,
                    cards: {
                        sampleUid1: true,
                        sampleUid2: true,
                    },
                },
                sampleRuleId2: {
                    isExpanded: true,
                    cards: {
                        sampleUid1: true,
                        sampleUid2: true,
                    },
                },
            },
        };

        const expectedState: CardSelectionStoreData = {
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
        };

        createStoreForCardSelectionActions('collapseAllRules').testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState(): CardSelectionStoreData {
        return createStoreWithNullParams(CardSelectionStore).getDefaultState();
    }

    function createStoreForUnifiedScanResultActions(
        actionName: keyof UnifiedScanResultActions,
    ): StoreTester<CardSelectionStoreData, UnifiedScanResultActions> {
        const factory = (actions: UnifiedScanResultActions) => new CardSelectionStore(new CardSelectionActions(), actions);

        return new StoreTester(UnifiedScanResultActions, actionName, factory);
    }

    function createStoreForCardSelectionActions(
        actionName: keyof CardSelectionActions,
    ): StoreTester<CardSelectionStoreData, CardSelectionActions> {
        const factory = (actions: CardSelectionActions) => new CardSelectionStore(actions, new UnifiedScanResultActions());

        return new StoreTester(CardSelectionActions, actionName, factory);
    }
});
