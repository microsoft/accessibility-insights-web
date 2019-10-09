// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { cloneDeep } from 'lodash';
import { getHighlightsFromCardSelectionStoreData } from '../../../../common/get-highlights-from-card-selection-store-data';

describe('getHighlightsFromCardSelectionStoreData', () => {
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
            selectedCardCount: 0,
        };

        initialState = cloneDeep(defaultState);
    });

    test('all rules collapsed, expect all highlights', () => {
        const results = getHighlightsFromCardSelectionStoreData(initialState);

        expect(results).toEqual(['sampleUid1', 'sampleUid2', 'sampleUid3', 'sampleUid4']);
    });

    test('all rules expanded, expect all highlights', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId2'].isExpanded = true;

        const results = getHighlightsFromCardSelectionStoreData(initialState);

        expect(results).toEqual(['sampleUid1', 'sampleUid2', 'sampleUid3', 'sampleUid4']);
    });

    test('one rule expanded, expect some highlights', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;

        const results = getHighlightsFromCardSelectionStoreData(initialState);

        expect(results).toEqual(['sampleUid1', 'sampleUid2']);
    });

    test('all rules expanded, one card selected, expect one highlight', () => {
        initialState.rules['sampleRuleId1'].isExpanded = true;
        initialState.rules['sampleRuleId2'].isExpanded = true;
        initialState.rules['sampleRuleId2'].cards['sampleUid3'] = true;
        initialState.selectedCardCount = 1;

        const results = getHighlightsFromCardSelectionStoreData(initialState);

        expect(results).toEqual(['sampleUid3']);
    });

    test('all rules collapsed, one card selected, expect all highlights', () => {
        initialState.rules['sampleRuleId2'].cards['sampleUid3'] = true;
        initialState.selectedCardCount = 1;

        const results = getHighlightsFromCardSelectionStoreData(initialState);

        expect(results).toEqual(['sampleUid1', 'sampleUid2', 'sampleUid3', 'sampleUid4']);
    });

    test('null store data, expect no results', () => {
        const results = getHighlightsFromCardSelectionStoreData(null);

        expect(results).toEqual([]);
    });

    test('invalid store data, expect no results', () => {
        const results = getHighlightsFromCardSelectionStoreData({} as CardSelectionStoreData);

        expect(results).toEqual([]);
    });
});
