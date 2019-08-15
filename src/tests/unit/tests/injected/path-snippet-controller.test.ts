// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetStore } from 'background/stores/path-snippet-store';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { PathSnippetStoreData } from '../../../../common/types/store-data/path-snippet-store-data';
import { ElementFinderByPath } from '../../../../injected/element-finder-by-path';
import { PathSnippetController } from '../../../../injected/path-snippet-controller';

describe('InspectControllerTests', () => {
    let pathSnippetStoreMock: IMock<PathSnippetStore>;
    let pathSnippetStoreState: PathSnippetStoreData;
    let testObject: PathSnippetController;

    let elementFinderMock: IMock<ElementFinderByPath>;
    let addCorrespondingSnippetMock: IMock<(associatedPath: string, showError: boolean, snippet: string) => void>;
    let processRequestCallback: (snippet: string, path: string) => void;
    let processRequestPromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
    let promiseStub;

    beforeEach(() => {
        pathSnippetStoreMock = Mock.ofType(PathSnippetStore);
        pathSnippetStoreMock.setup(sm => sm.addChangedListener(It.is(isFunction)));
        pathSnippetStoreMock.setup(sm => sm.getState()).returns(() => pathSnippetStoreState);

        elementFinderMock = Mock.ofType(ElementFinderByPath);

        addCorrespondingSnippetMock = Mock.ofInstance((associatedPath: string, showError: boolean, snippet: string) => {});

        processRequestPromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
        promiseStub = {
            then: processRequestPromiseHandlerMock.object,
        };

        testObject = new PathSnippetController(pathSnippetStoreMock.object, elementFinderMock.object, addCorrespondingSnippetMock.object);
    });

    afterEach(() => {
        pathSnippetStoreState = {
            path: null,
            snippetCondition: { associatedPath: null, showError: false, snippet: null },
        };
    });

    test('do not add snippet if path snippet store state is null', () => {
        pathSnippetStoreState = null;
        testObject.listenToStore();

        listenAndVerify();
    });

    test('do not add snippet if path is null', () => {
        pathSnippetStoreState = {
            path: null,
            snippetCondition: { associatedPath: null, showError: false, snippet: null },
        };
        testObject.listenToStore();

        listenAndVerify();
    });

    test('call add snippet if path snippet store state has changed', async () => {
        const givenPath = '.test path';
        const retrievedSnippet = '<test snippet>';
        const showError = false;

        setupGetElementFromPath(givenPath);

        addCorrespondingSnippetMock.setup(sm => sm(givenPath, showError, retrievedSnippet)).verifiable(Times.once());

        testObject.listenToStore();
        processRequestCallback(retrievedSnippet, pathSnippetStoreState.path);

        listenAndVerify();
    });

    test('add failure message if no snippet found', async () => {
        const givenPath = '.test path';
        const showError = false;

        setupGetElementFromPath(givenPath);

        addCorrespondingSnippetMock.setup(sm => sm(givenPath, showError, null)).verifiable(Times.once());

        testObject.listenToStore();
        processRequestCallback(null, pathSnippetStoreState.path);

        listenAndVerify();
    });

    test("don't call add snippet if path snippet store state has empty path", () => {
        const givenPath = '';

        pathSnippetStoreState = {
            path: givenPath,
            snippetCondition: { associatedPath: givenPath, showError: false, snippet: '' },
        };

        testObject.listenToStore();

        listenAndVerify();
    });

    function setupGetElementFromPath(givenPath: string): void {
        pathSnippetStoreState = {
            path: givenPath,
            snippetCondition: { associatedPath: givenPath, showError: false, snippet: null },
        };

        const expectedMessage = {
            path: [givenPath],
        };

        elementFinderMock
            .setup(finder => finder.processRequest(It.isValue(expectedMessage)))
            .returns(() => promiseStub)
            .verifiable(Times.once());

        processRequestPromiseHandlerMock
            .setup(phm => phm(It.isAny(), It.isAny()))
            .callback((success, error) => {
                processRequestCallback = success;
            });
    }

    function listenAndVerify(): void {
        pathSnippetStoreMock.verifyAll();
        elementFinderMock.verifyAll();
        addCorrespondingSnippetMock.verifyAll();
    }
});
