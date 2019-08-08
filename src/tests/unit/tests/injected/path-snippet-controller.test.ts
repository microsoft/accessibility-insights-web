// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { PathSnippetStore } from '../../../../background/stores/path-snippet-store';
import { PathSnippetStoreData } from '../../../../common/types/store-data/path-snippet-store-data';
import { ElementFinderByPath } from '../../../../injected/element-finder-by-path';
import { PathSnippetController } from '../../../../injected/path-snippet-controller';

describe('PathSnippetControllerTests', () => {
    let pathSnippetStoreMock: IMock<PathSnippetStore>;
    let pathSnippetStoreState: PathSnippetStoreData;
    let testObject: PathSnippetController;

    let elementFinderMock: IMock<ElementFinderByPath>;
    let addCorrespondingSnippetMock: IMock<(showError: boolean, snippet?: string) => void>;
    let processRequestPromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
    let promiseStub;
    let successCallback;
    let errorCallback;

    beforeEach(() => {
        pathSnippetStoreMock = Mock.ofType(PathSnippetStore);
        pathSnippetStoreMock.setup(sm => sm.addChangedListener(It.is(isFunction)));
        pathSnippetStoreMock.setup(sm => sm.getState()).returns(() => pathSnippetStoreState);

        elementFinderMock = Mock.ofType(ElementFinderByPath);

        addCorrespondingSnippetMock = Mock.ofInstance((showError: boolean, snippet?: string) => {});

        processRequestPromiseHandlerMock = Mock.ofInstance((successCb, errorCb) => {});
        promiseStub = {
            then: processRequestPromiseHandlerMock.object,
        };

        testObject = new PathSnippetController(pathSnippetStoreMock.object, elementFinderMock.object, addCorrespondingSnippetMock.object);
    });

    afterEach(() => {
        pathSnippetStoreState = {
            path: null,
            snippetCondition: { snippet: null, showError: false },
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
            snippetCondition: { snippet: null, showError: false },
        };
        testObject.listenToStore();

        listenAndVerify();
    });

    test('call add snippet if path snippet store state has changed', async () => {
        const givenPath = '.test path';
        const retrievedSnippet = '<test snippet>';
        const snippetError = false;

        setupGetElementFromPath(givenPath, true);

        addCorrespondingSnippetMock.setup(sm => sm(snippetError, retrievedSnippet)).verifiable(Times.once());

        testObject.listenToStore();

        successCallback(retrievedSnippet);
        listenAndVerify();
    });

    test('add failure message if no snippet found', async () => {
        const givenPath = '.test path';
        const showError = true;

        setupGetElementFromPath(givenPath, false);

        addCorrespondingSnippetMock.setup(sm => sm(showError, 'No code snippet is mapped to: ' + givenPath)).verifiable(Times.once());

        testObject.listenToStore();

        errorCallback();
        listenAndVerify();
    });

    test("don't call add snippet if path snippet store state has empty path", () => {
        const givenPath = '';

        pathSnippetStoreState = {
            path: givenPath,
            snippetCondition: { snippet: null, showError: false },
        };

        testObject.listenToStore();

        listenAndVerify();
    });

    function setupGetElementFromPath(givenPath: string, successful: boolean): void {
        pathSnippetStoreState = {
            path: givenPath,
            snippetCondition: { snippet: null, showError: false },
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
                if (successful) {
                    successCallback = success;
                } else {
                    errorCallback = error;
                }
            });
    }

    function listenAndVerify(): void {
        pathSnippetStoreMock.verifyAll();
        elementFinderMock.verifyAll();
        addCorrespondingSnippetMock.verifyAll();
    }
});
