// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { cloneDeep } from 'lodash';
import { getCardSelectionViewData } from '../../../../common/get-card-selection-view-data';

describe('getCardSelectionStoreviewData', () => {
    let initialState: CardSelectionStoreData;

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
                        sampleUid3: false,
                        sampleUid4: false,
                    },
                },
            },
            visualHelperEnabled: false,
        };

        initialState = cloneDeep(defaultState);
    });

    test('all rules collapsed, expect all highlights', () => {
        const viewData = getCardSelectionViewData(initialState);

        expect(viewData.highlightedResultUids).toEqual(['sampleUid1', 'sampleUid2', 'sampleUid3', 'sampleUid4']);
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
    });

    test('all rules expanded, expect all highlights', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId2'].isExpanded = true;

        const viewData = getCardSelectionViewData(initialState);

        expect(viewData.highlightedResultUids).toEqual(['sampleUid1', 'sampleUid2', 'sampleUid3', 'sampleUid4']);
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1', 'sampleRuleId2']);
        expect(viewData.selectedResultUids).toEqual([]);
    });

    test('one rule expanded, expect some highlights', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;

        const viewData = getCardSelectionViewData(initialState);

        expect(viewData.highlightedResultUids).toEqual(['sampleUid1', 'sampleUid2']);
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1']);
        expect(viewData.selectedResultUids).toEqual([]);
    });

    test('all rules expanded, one card selected, expect one highlight', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId2'].isExpanded = true;
        initialState.rules['sampleRuleId2'].cards['sampleUid3'] = true;

        const viewData = getCardSelectionViewData(initialState);

        expect(viewData.highlightedResultUids).toEqual(['sampleUid3']);
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1', 'sampleRuleId2']);
        expect(viewData.selectedResultUids).toEqual(['sampleUid3']);
    });

    test('all rules collapsed, one card selected, expect all highlights', () => {
        initialState.rules['sampleRuleId2'].cards['sampleUid3'] = true;

        const viewData = getCardSelectionViewData(initialState);

        expect(viewData.highlightedResultUids).toEqual(['sampleUid1', 'sampleUid2', 'sampleUid3', 'sampleUid4']);
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
    });

    test('null store data, expect no results', () => {
        const viewData = getCardSelectionViewData(null);

        expect(viewData.highlightedResultUids).toEqual([]);
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
    });

    test('invalid store data, expect no results', () => {
        const viewData = getCardSelectionViewData({} as CardSelectionStoreData);

        expect(viewData.highlightedResultUids).toEqual([]);
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
    });
});
