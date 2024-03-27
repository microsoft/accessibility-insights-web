// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardSelectionViewData,
    GetCardSelectionViewData,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { ScanNodeResult } from 'common/store-data-to-scan-node-result-converter';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { ElementBasedViewModelCreator } from 'injected/element-based-view-model-creator';
import { GetDecoratedAxeNodeCallback } from 'injected/get-decorated-axe-node';
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

        cardSelectionData = { rules: {} } as CardSelectionStoreData;
    });

    test('getElementBasedViewModel: results are null', () => {
        const cardSelectionDataStub = {} as CardSelectionStoreData;
        expect(testSubject.getElementBasedViewModel(null, cardSelectionDataStub)).toBeNull();
    });

    test('getElementBasedViewModel: cardSelectionData are null', () => {
        const dataStub = [];
        const cardSelectionDataStub = null;
        expect(testSubject.getElementBasedViewModel(dataStub, cardSelectionDataStub)).toBeNull();
    });

    test('getElementBasedViewModel: cardSelectionData.rules are null', () => {
        const dataStub = [];
        const cardSelectionDataStub = {
            rules: null,
            visualHelperEnabled: true,
            focusedResultUid: null,
        };
        expect(testSubject.getElementBasedViewModel(dataStub, cardSelectionDataStub)).toBeNull();
    });

    test('getElementBasedViewModel: no highlighted results', () => {
        const unifiedResult = exampleUnifiedResult;
        const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
        const scanNodeResults: ScanNodeResult[] = [{ ...unifiedResult, rule: ruleStub }];
        const cardSelectionViewData = {
            resultsHighlightStatus: { [unifiedResult.uid]: 'hidden' },
        } as CardSelectionViewData;

        getHighlightedResultInstanceIdsMock
            .setup(mock =>
                mock(cardSelectionData, scanNodeResults, null, isResultHighlightUnavailableStub),
            )
            .returns(() => cardSelectionViewData);

        const expectedResult = {};

        expect(testSubject.getElementBasedViewModel(scanNodeResults, cardSelectionData)).toEqual(
            expectedResult,
        );
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
            const identifierStub = unifiedResult.identifiers['css-selector'];
            const decoratedResultStub = {} as DecoratedAxeNodeResult;
            const scanNodeResults: ScanNodeResult[] = [{ ...unifiedResult, rule: ruleStub }];
            const cardSelectionViewData = {
                resultsHighlightStatus: { [unifiedResult.uid]: 'visible' },
            } as CardSelectionViewData;

            getHighlightedResultInstanceIdsMock
                .setup(mock =>
                    mock(
                        cardSelectionData,
                        scanNodeResults,
                        null,
                        isResultHighlightUnavailableStub,
                    ),
                )
                .returns(() => cardSelectionViewData);

            getDecoratedAxeNodeCallbackMock
                .setup(mock => mock(scanNodeResults[0], ruleStub, identifierStub))
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
                testSubject.getElementBasedViewModel(scanNodeResults, cardSelectionData),
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

        const identifierStub = unifiedResultOne.identifiers['css-selector'];
        const decoratedResultStubOne = {
            id: 'some id',
        } as DecoratedAxeNodeResult;
        const decoratedResultStubTwo = {
            id: 'some other id',
        } as DecoratedAxeNodeResult;

        const scanNodeResults: ScanNodeResult[] = [
            { ...unifiedResultOne, rule: ruleStubOne },
            { ...unifiedResultTwo, rule: ruleStubTwo },
        ];
        const cardSelectionViewData = {
            resultsHighlightStatus: {
                [unifiedResultOne.uid]: 'visible',
                [unifiedResultTwo.uid]: 'visible',
            },
        } as CardSelectionViewData;

        getHighlightedResultInstanceIdsMock
            .setup(mock =>
                mock(cardSelectionData, scanNodeResults, null, isResultHighlightUnavailableStub),
            )
            .returns(() => cardSelectionViewData);

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(scanNodeResults[0], ruleStubOne, identifierStub))
            .returns(() => decoratedResultStubOne);

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(scanNodeResults[1], ruleStubTwo, identifierStub))
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

        expect(testSubject.getElementBasedViewModel(scanNodeResults, cardSelectionData)).toEqual(
            expectedResult,
        );
    });

    test('getElementBasedViewModel: preserves target if present', () => {
        const unifiedResult = cloneDeep(exampleUnifiedResult);
        const expectedTarget = [['target1', 'target2']];
        unifiedResult.identifiers.target = expectedTarget;
        const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
        const identifierStub = unifiedResult.identifiers['css-selector'];
        const decoratedResultStub = {} as DecoratedAxeNodeResult;
        const scanNodeResults: ScanNodeResult[] = [{ ...unifiedResult, rule: ruleStub }];
        const cardSelectionViewData = {
            resultsHighlightStatus: { [unifiedResult.uid]: 'visible' },
        } as CardSelectionViewData;

        getHighlightedResultInstanceIdsMock
            .setup(mock =>
                mock(cardSelectionData, scanNodeResults, null, isResultHighlightUnavailableStub),
            )
            .returns(() => cardSelectionViewData);

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(scanNodeResults[0], ruleStub, identifierStub))
            .returns(() => decoratedResultStub);

        const expectedResult = {
            [identifierStub]: {
                isFailure: true,
                isVisualizationEnabled: true,
                target: expectedTarget,
                ruleResults: {
                    [ruleStub.id]: decoratedResultStub,
                },
            },
        };

        expect(testSubject.getElementBasedViewModel(scanNodeResults, cardSelectionData)).toEqual(
            expectedResult,
        );
    });
});
