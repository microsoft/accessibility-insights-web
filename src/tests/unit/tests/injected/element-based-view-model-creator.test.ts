// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardSelectionViewData,
    GetCardSelectionViewData,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    UnifiedRule,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { ElementBasedViewModelCreator } from 'injected/element-based-view-model-creator';
import { GetDecoratedAxeNodeCallback } from 'injected/get-decorated-axe-node';
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { cloneDeep } from 'lodash';
import { exampleUnifiedResult } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('ElementBasedViewModelCreator', () => {
    let getDecoratedAxeNodeCallbackMock: IMock<GetDecoratedAxeNodeCallback>;
    let getHighlightedResultInstanceIdsMock: IMock<GetCardSelectionViewData>;
    let testSubject: ElementBasedViewModelCreator;
    let cardSelectionData: CardSelectionStoreData;
    let isResultHighlightUnavailableStub: IsResultHighlightUnavailable;

    beforeEach(() => {
        getDecoratedAxeNodeCallbackMock = Mock.ofType<GetDecoratedAxeNodeCallback>(
            undefined,
            MockBehavior.Strict,
        );
        getHighlightedResultInstanceIdsMock = Mock.ofType<GetCardSelectionViewData>(
            undefined,
            MockBehavior.Strict,
        );
        isResultHighlightUnavailableStub = () => null;
        testSubject = new ElementBasedViewModelCreator(
            getDecoratedAxeNodeCallbackMock.object,
            getHighlightedResultInstanceIdsMock.object,
            isResultHighlightUnavailableStub,
        );

        cardSelectionData = {} as CardSelectionStoreData;
    });

    test('getElementBasedViewModel: rules are null', () => {
        expect(
            testSubject.getElementBasedViewModel(
                { results: [] } as UnifiedScanResultStoreData,
                {} as CardSelectionStoreData,
            ),
        ).toBeNull();
    });

    test('getElementBasedViewModel: results are null', () => {
        expect(
            testSubject.getElementBasedViewModel(
                { rules: [] } as UnifiedScanResultStoreData,
                {} as CardSelectionStoreData,
            ),
        ).toBeNull();
    });

    test('getElementBasedViewModel: cardSelectionData are null', () => {
        expect(
            testSubject.getElementBasedViewModel(
                { rules: [], results: [] } as UnifiedScanResultStoreData,
                null,
            ),
        ).toBeNull();
    });

    test('getElementBasedViewModel: no highlighted results', () => {
        const unifiedResult = exampleUnifiedResult;
        const scanResultStoreData = {
            results: [unifiedResult],
            rules: [],
        } as UnifiedScanResultStoreData;
        const cardSelectionViewData = {
            resultsHighlightStatus: { [unifiedResult.uid]: 'hidden' },
        } as CardSelectionViewData;

        getHighlightedResultInstanceIdsMock
            .setup(mock =>
                mock(cardSelectionData, scanResultStoreData, isResultHighlightUnavailableStub),
            )
            .returns(() => cardSelectionViewData);

        const expectedResult = {};

        expect(
            testSubject.getElementBasedViewModel(scanResultStoreData, cardSelectionData),
        ).toEqual(expectedResult);
    });

    test.each`
        testStatus   | expectedIsFailure
        ${'fail'}    | ${true}
        ${'unknown'} | ${false}
    `(
        'getElementBasedViewModel: one element, one result, with status=$testStatus',
        ({ testStatus, expectedIsFailure }) => {
            const unifiedResult = cloneDeep(exampleUnifiedResult);
            unifiedResult.status = testStatus;
            const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
            const unifiedRules = [ruleStub];
            const identifierStub = unifiedResult.identifiers['css-selector'];
            const decoratedResultStub = {} as DecoratedAxeNodeResult;
            const scanResultStoreData = {
                results: [unifiedResult],
                rules: unifiedRules,
            } as UnifiedScanResultStoreData;
            const cardSelectionViewData = {
                resultsHighlightStatus: { [unifiedResult.uid]: 'visible' },
            } as CardSelectionViewData;

            getHighlightedResultInstanceIdsMock
                .setup(mock =>
                    mock(cardSelectionData, scanResultStoreData, isResultHighlightUnavailableStub),
                )
                .returns(() => cardSelectionViewData);

            getDecoratedAxeNodeCallbackMock
                .setup(mock => mock(unifiedResult, ruleStub, identifierStub))
                .returns(() => decoratedResultStub);

            const expectedResult = {
                [identifierStub]: {
                    isFailure: expectedIsFailure,
                    isVisualizationEnabled: true,
                    target: identifierStub.split(';'),
                    ruleResults: {
                        [ruleStub.id]: decoratedResultStub,
                    },
                },
            };

            expect(
                testSubject.getElementBasedViewModel(scanResultStoreData, cardSelectionData),
            ).toEqual(expectedResult);
        },
    );

    test('getElementBasedViewModel: two results that map to one element', () => {
        const unifiedResultOne = cloneDeep(exampleUnifiedResult);
        const unifiedResultTwo = cloneDeep(exampleUnifiedResult);
        unifiedResultTwo.uid = unifiedResultTwo.uid.concat('two');
        unifiedResultTwo.ruleId = unifiedResultTwo.ruleId.concat('two');

        const ruleStubOne = { id: unifiedResultOne.ruleId } as UnifiedRule;
        const ruleStubTwo = { id: unifiedResultTwo.ruleId } as UnifiedRule;
        const unifiedRules = [ruleStubOne, ruleStubTwo];

        const identifierStub = unifiedResultOne.identifiers['css-selector'];
        const decoratedResultStubOne = {
            id: 'some id',
        } as DecoratedAxeNodeResult;
        const decoratedResultStubTwo = {
            id: 'some other id',
        } as DecoratedAxeNodeResult;

        const scanResultStoreData = {
            results: [unifiedResultOne, unifiedResultTwo],
            rules: unifiedRules,
        } as UnifiedScanResultStoreData;
        const cardSelectionViewData = {
            resultsHighlightStatus: {
                [unifiedResultOne.uid]: 'visible',
                [unifiedResultTwo.uid]: 'visible',
            },
        } as CardSelectionViewData;

        getHighlightedResultInstanceIdsMock
            .setup(mock =>
                mock(cardSelectionData, scanResultStoreData, isResultHighlightUnavailableStub),
            )
            .returns(() => cardSelectionViewData);

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(unifiedResultOne, ruleStubOne, identifierStub))
            .returns(() => decoratedResultStubOne);

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(unifiedResultTwo, ruleStubTwo, identifierStub))
            .returns(() => decoratedResultStubTwo);

        const expectedResult = {
            [identifierStub]: {
                isFailure: true,
                isVisualizationEnabled: true,
                target: identifierStub.split(';'),
                ruleResults: {
                    [ruleStubOne.id]: decoratedResultStubOne,
                    [ruleStubTwo.id]: decoratedResultStubTwo,
                },
            },
        };

        expect(
            testSubject.getElementBasedViewModel(scanResultStoreData, cardSelectionData),
        ).toEqual(expectedResult);
    });
});
