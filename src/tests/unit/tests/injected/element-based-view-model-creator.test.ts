// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { UnifiedRule } from 'common/types/store-data/unified-data-interface';
import { ElementBasedViewModelCreator, GetHighlightedResultInstanceIdsCallback } from 'injected/element-based-view-model-creator';
import { GetDecoratedAxeNodeCallback } from 'injected/get-decorated-axe-node';
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { cloneDeep } from 'lodash';
import { exampleUnifiedResult } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('ElementBasedViewModelCreator', () => {
    let getDecoratedAxeNodeCallbackMock: IMock<GetDecoratedAxeNodeCallback>;
    let getHighlightedResultInstanceIdsMock: IMock<GetHighlightedResultInstanceIdsCallback>;
    let testSubject: ElementBasedViewModelCreator;
    let cardSelectionData: CardSelectionStoreData;

    beforeEach(() => {
        getDecoratedAxeNodeCallbackMock = Mock.ofType<GetDecoratedAxeNodeCallback>(undefined, MockBehavior.Strict);
        getHighlightedResultInstanceIdsMock = Mock.ofType<GetHighlightedResultInstanceIdsCallback>(undefined, MockBehavior.Strict);
        testSubject = new ElementBasedViewModelCreator(getDecoratedAxeNodeCallbackMock.object, getHighlightedResultInstanceIdsMock.object);

        cardSelectionData = {} as CardSelectionStoreData;
    });

    test('getElementBasedViewModel: rules are null', () => {
        expect(testSubject.getElementBasedViewModel(null, [], {} as CardSelectionStoreData)).toBeUndefined();
    });

    test('getElementBasedViewModel: results are null', () => {
        expect(testSubject.getElementBasedViewModel([], null, {} as CardSelectionStoreData)).toBeUndefined();
    });

    test('getElementBasedViewModel: cardSelectionData are null', () => {
        expect(testSubject.getElementBasedViewModel([], [], null)).toBeUndefined();
    });

    test('getElementBasedViewModel: no failing results', () => {
        const highlightedInstanceIds = [];
        const unifiedResult = exampleUnifiedResult;

        unifiedResult.status = 'pass';
        getHighlightedResultInstanceIdsMock
            .setup(mock => mock(cardSelectionData))
            .returns(() => ({
                highlightedResultUids: highlightedInstanceIds,
            }));

        const expectedResult = {};
        expect(testSubject.getElementBasedViewModel([], [unifiedResult], cardSelectionData)).toEqual(expectedResult);
    });

    test('getElementBasedViewModel: no highlighted results', () => {
        const highlightedInstanceIds = [];
        const unifiedResult = exampleUnifiedResult;

        unifiedResult.status = 'fail';
        getHighlightedResultInstanceIdsMock
            .setup(mock => mock(cardSelectionData))
            .returns(() => ({ highlightedResultUids: highlightedInstanceIds }));

        const expectedResult = {};
        expect(testSubject.getElementBasedViewModel([], [unifiedResult], cardSelectionData)).toEqual(expectedResult);
    });

    test('getElementBasedViewModel: one element, one result', () => {
        const unifiedResult = exampleUnifiedResult;
        const highlightedInstanceIds = [unifiedResult.uid];
        const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
        const unifiedRules = [ruleStub];
        const identifierStub = unifiedResult.identifiers['css-selector'];
        const decoratedResultStub = {} as DecoratedAxeNodeResult;

        unifiedResult.status = 'fail';
        getHighlightedResultInstanceIdsMock
            .setup(mock => mock(cardSelectionData))
            .returns(() => ({ highlightedResultUids: highlightedInstanceIds }));
        getDecoratedAxeNodeCallbackMock.setup(mock => mock(unifiedResult, ruleStub, identifierStub)).returns(() => decoratedResultStub);

        const expectedResult = {
            [identifierStub]: {
                isFailure: true,
                isVisualizationEnabled: true,
                target: identifierStub.split(';'),
                ruleResults: {
                    [ruleStub.id]: decoratedResultStub,
                },
            },
        };

        expect(testSubject.getElementBasedViewModel(unifiedRules, [unifiedResult], cardSelectionData)).toEqual(expectedResult);
    });

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

        const highlightedInstanceIds = [unifiedResultOne.uid, unifiedResultTwo.uid];
        getHighlightedResultInstanceIdsMock
            .setup(mock => mock(cardSelectionData))
            .returns(() => ({ highlightedResultUids: highlightedInstanceIds }));

        unifiedResultOne.status = 'fail';
        unifiedResultTwo.status = 'fail';

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(unifiedResultOne, ruleStubOne, identifierStub))
            .returns(() => decoratedResultStubOne);

        getDecoratedAxeNodeCallbackMock
            .setup(mock => mock(unifiedResultTwo, ruleStubTwo, identifierStub))
            .returns(() => decoratedResultStubTwo);

        const unifiedResults = [unifiedResultOne, unifiedResultTwo];
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

        expect(testSubject.getElementBasedViewModel(unifiedRules, unifiedResults, cardSelectionData)).toEqual(expectedResult);
    });
});
