// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { PathSnippetStore } from '../../../../background/stores/path-snippet-store';
import { PathSnippetStoreData } from '../../../../common/types/store-data/path-snippet-store-data';
import { ElementFinderByPath } from '../../../../injected/element-finder-by-path';
import { PathSnippetController } from '../../../../injected/path-snippet-controller';

describe('InspectControllerTests', () => {
    let pathSnippetStoreMock: IMock<PathSnippetStore>;
    let pathSnippetStoreState: PathSnippetStoreData;
    let testObject: PathSnippetController;

    let elementFinderMock: IMock<ElementFinderByPath>;
    let addCorrespondingSnippetMock: IMock<(snippet: string) => void>;
    let processRequestCallback: (snippet: string) => void;
    let promiseHandlerMock: IMock<(callback: Function) => void>;
    let promiseStub;

    beforeEach(() => {
        pathSnippetStoreMock = Mock.ofType(PathSnippetStore);
        pathSnippetStoreMock.setup(sm => sm.addChangedListener(It.is(isFunction)));
        pathSnippetStoreMock.setup(sm => sm.getState()).returns(() => pathSnippetStoreState);

        elementFinderMock = Mock.ofType(ElementFinderByPath);

        addCorrespondingSnippetMock = Mock.ofInstance((snippet: string) => {});
        processRequestCallback = null;

        promiseHandlerMock = Mock.ofInstance(callback => {});
        promiseStub = {
            then: promiseHandlerMock.object,
        };

        testObject = new PathSnippetController(pathSnippetStoreMock.object, elementFinderMock.object, addCorrespondingSnippetMock.object);
    });

    afterEach(() => {
        pathSnippetStoreState = {
            path: null,
            snippet: null,
        };
    });

    test('do not add snippet if path snippet store state is null', () => {
        pathSnippetStoreState = null;

        testObject.listenToStore();

        listenAndVerify();
    });

    test('call add snippet if path snippet store state has changed', async () => {
        const givenPath = '.test path';
        const retrievedSnippet = '<test snippet>';

        pathSnippetStoreState = {
            path: givenPath,
            snippet: null,
        };

        const expectedMessage = {
            path: [givenPath],
        };

        elementFinderMock
            .setup(finder => finder.processRequest(It.isValue(expectedMessage)))
            .returns(() => promiseStub)
            .verifiable(Times.once());

        promiseHandlerMock
            .setup(phm => phm(It.isAny()))
            .callback(callback => {
                processRequestCallback = callback;
            });

        addCorrespondingSnippetMock.setup(sm => sm(retrievedSnippet)).verifiable(Times.once());

        testObject.listenToStore();
        processRequestCallback(retrievedSnippet);

        listenAndVerify();
    });

    test("don't call add snippet if path snippet store state has empty path", () => {
        const givenPath = '';

        pathSnippetStoreState = {
            path: givenPath,
            snippet: '',
        };

        testObject.listenToStore();

        listenAndVerify();
    });

    function listenAndVerify(): void {
        pathSnippetStoreMock.verifyAll();
        elementFinderMock.verifyAll();
        addCorrespondingSnippetMock.verifyAll();
    }
});
