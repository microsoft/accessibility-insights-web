// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { ResultsFilter } from 'common/types/results-filter';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    PlatformData,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { cloneDeep } from 'lodash';
import { IMock, Mock } from 'typemoq';

import {
    CardSelectionViewData,
    getCardSelectionViewData,
} from '../../../../common/get-card-selection-view-data';

describe('getCardSelectionStoreviewData', () => {
    let initialCardSelectionState: CardSelectionStoreData;
    let initialUnifiedScanResultState: UnifiedScanResultStoreData;
    let isResultHighlightUnavailable: IMock<IsResultHighlightUnavailable>;
    let resultsFilter: ResultsFilter;

    beforeEach(() => {
        const defaultCardSelectionState: CardSelectionStoreData = {
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
            visualHelperEnabled: true,
            focusedResultUid: null,
        };
        initialUnifiedScanResultState = {
            platformInfo: {
                viewPortInfo: {},
            },
            results: [
                {
                    uid: 'sampleUid1',
                    status: 'fail',
                },
                {
                    uid: 'sampleUid2',
                    status: 'fail',
                },
                {
                    uid: 'sampleUid3',
                    status: 'fail',
                },
                {
                    uid: 'sampleUid4',
                    status: 'fail',
                },
                {
                    uid: 'sampleUid5',
                    status: 'pass',
                },
            ],
        } as UnifiedScanResultStoreData;

        isResultHighlightUnavailable = Mock.ofType<IsResultHighlightUnavailable>();
        initialCardSelectionState = cloneDeep(defaultCardSelectionState);
    });

    test('all rules collapsed, visual helper enabled, no resultsFilter, expect all highlights', () => {
        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'visible',
            sampleUid2: 'visible',
            sampleUid3: 'visible',
            sampleUid4: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules collapsed, visual helper enabled, resultsFilter passed, expect only filtered highlights', () => {
        resultsFilter = res => res.uid === 'sampleUid3';

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
            resultsFilter,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid3: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules collapsed, visual helper enabled, some results unavailable', () => {
        isResultHighlightUnavailable
            .setup(mock =>
                mock(
                    initialUnifiedScanResultState.results[0],
                    initialUnifiedScanResultState.platformInfo,
                ),
            )
            .returns(() => true);

        isResultHighlightUnavailable
            .setup(mock =>
                mock(
                    initialUnifiedScanResultState.results[1],
                    initialUnifiedScanResultState.platformInfo,
                ),
            )
            .returns(() => true);

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'unavailable',
            sampleUid2: 'unavailable',
            sampleUid3: 'visible',
            sampleUid4: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('rule expanded with a selected card that is unavailable for highlight', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId1'].cards['sampleUid1'] = true;

        isResultHighlightUnavailable
            .setup(mock =>
                mock(
                    initialUnifiedScanResultState.results[0],
                    initialUnifiedScanResultState.platformInfo,
                ),
            )
            .returns(() => true);

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'unavailable',
            sampleUid2: 'hidden',
            sampleUid3: 'hidden',
            sampleUid4: 'hidden',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1']);
        expect(viewData.selectedResultUids).toEqual(['sampleUid1']);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('some rules expanded, some highlights unavailable regardless, some visible', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;

        isResultHighlightUnavailable
            .setup(mock =>
                mock(
                    initialUnifiedScanResultState.results[0],
                    initialUnifiedScanResultState.platformInfo,
                ),
            )
            .returns(() => true);

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'unavailable',
            sampleUid2: 'visible',
            sampleUid3: 'hidden',
            sampleUid4: 'hidden',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1']);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules expanded, visual helper enabled, expect all highlights', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].isExpanded = true;

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'visible',
            sampleUid2: 'visible',
            sampleUid3: 'visible',
            sampleUid4: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1', 'sampleRuleId2']);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('one rule expanded, visual helper enabled, expect some highlights', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'visible',
            sampleUid2: 'visible',
            sampleUid3: 'hidden',
            sampleUid4: 'hidden',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1']);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('one rule expanded, visual helper enabled, resultsFilter passed, expect some highlights', () => {
        resultsFilter = res => res.uid === 'sampleUid2';
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
            resultsFilter,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid2: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1']);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules expanded, visual helper enabled, one card selected, expect one highlight', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].cards['sampleUid3'] = true;

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'hidden',
            sampleUid2: 'hidden',
            sampleUid3: 'visible',
            sampleUid4: 'hidden',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1', 'sampleRuleId2']);
        expect(viewData.selectedResultUids).toEqual(['sampleUid3']);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules expanded, visual helper enabled, one card selected, resultsFilter passed, expect only filtered highlights', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].cards['sampleUid3'] = true;
        resultsFilter = res => res.uid === 'sampleUid2';

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
            resultsFilter,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid2: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1', 'sampleRuleId2']);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules collapsed, visual helper enabled , one card selected, expect all highlights', () => {
        initialCardSelectionState.rules['sampleRuleId2'].cards['sampleUid3'] = true;

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'visible',
            sampleUid2: 'visible',
            sampleUid3: 'visible',
            sampleUid4: 'visible',
        });
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(true);
    });

    test('all rules expanded, visual helper disabled, one card selected, expect no highlights or selected cards but rules still expanded', () => {
        initialCardSelectionState.rules['sampleRuleId1'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].isExpanded = true;
        initialCardSelectionState.rules['sampleRuleId2'].cards['sampleUid3'] = true;
        initialCardSelectionState.visualHelperEnabled = false;

        const viewData = getCardSelectionViewData(
            initialCardSelectionState,
            initialUnifiedScanResultState.results,
            initialUnifiedScanResultState.platformInfo,
            isResultHighlightUnavailable.object,
        );

        expect(viewData.resultsHighlightStatus).toEqual({
            sampleUid1: 'hidden',
            sampleUid2: 'hidden',
            sampleUid3: 'hidden',
            sampleUid4: 'hidden',
        });
        expect(viewData.expandedRuleIds).toEqual(['sampleRuleId1', 'sampleRuleId2']);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(false);
    });

    test('null store data, expect no results', () => {
        const viewData = getCardSelectionViewData(null, null, null, null);

        validateEmptyViewData(viewData);
    });

    test('empty CardSelectionStoreData, expect no results', () => {
        const viewData = getCardSelectionViewData(
            {} as CardSelectionStoreData,
            [],
            {} as PlatformData,
            null,
        );

        validateEmptyViewData(viewData);
    });

    test('empty CardSelectionStoreData.rules, expect no results', () => {
        const viewData = getCardSelectionViewData(
            {
                visualHelperEnabled: false,
                focusedResultUid: null,
            } as CardSelectionStoreData,
            [],
            {} as PlatformData,
            null,
        );

        validateEmptyViewData(viewData);
    });

    test('invalid UnifiedScanResultStoreData, expect no results', () => {
        const viewData = getCardSelectionViewData(
            {} as CardSelectionStoreData,
            null,
            {} as PlatformData,
            null,
        );

        validateEmptyViewData(viewData);
    });

    function validateEmptyViewData(viewData: CardSelectionViewData): void {
        expect(viewData.resultsHighlightStatus).toEqual({});
        expect(viewData.expandedRuleIds).toEqual([]);
        expect(viewData.selectedResultUids).toEqual([]);
        expect(viewData.visualHelperEnabled).toEqual(false);
    }
});
