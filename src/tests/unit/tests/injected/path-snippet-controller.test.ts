// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetStore } from 'background/stores/path-snippet-store';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { PathSnippetStoreData } from '../../../../common/types/store-data/path-snippet-store-data';
import { ElementFinderByPath } from '../../../../injected/element-finder-by-path';
import { PathSnippetController } from '../../../../injected/path-snippet-controller';

// TEST FAILING: ISSUES WITH ADDING A SNIPPET AND ADDING A FAILURE

describe('PathSnippetControllerTests', () => {
    let pathSnippetStoreMock: IMock<PathSnippetStore>;
    let pathSnippetStoreState: PathSnippetStoreData;
    let testObject: PathSnippetController;

    let elementFinderMock: IMock<ElementFinderByPath>;
    let addCorrespondingSnippetMock: IMock<(snippet: string) => void>;

    beforeEach(() => {
        pathSnippetStoreMock = Mock.ofType(PathSnippetStore);
        pathSnippetStoreMock.setup(sm => sm.addChangedListener(It.is(isFunction)));
        pathSnippetStoreMock.setup(sm => sm.getState()).returns(() => pathSnippetStoreState);

        elementFinderMock = Mock.ofType(ElementFinderByPath);

        addCorrespondingSnippetMock = Mock.ofInstance((snippet: string) => {});

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

    test('do not add snippet if path is null', () => {
        pathSnippetStoreState = {
            path: null,
            snippet: null,
        };
        testObject.listenToStore();

        listenAndVerify();
    });

    test('call add snippet if path snippet store state has changed', async () => {
        const givenPath = '.test path';
        const retrievedSnippet = '<test snippet>';

        setupGetElementFromPath(givenPath, true, retrievedSnippet);

        addCorrespondingSnippetMock.setup(sm => sm(retrievedSnippet)).verifiable(Times.once());

        testObject.listenToStore();

        listenAndVerify();
    });

    test('add failure message if no snippet found', async () => {
        const givenPath = '.test path';
        const errorMessage = 'No code snippet is mapped to: ' + givenPath;

        setupGetElementFromPath(givenPath, false);

        addCorrespondingSnippetMock.setup(sm => sm(errorMessage)).verifiable(Times.once());

        testObject.listenToStore();

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

    function setupGetElementFromPath(givenPath: string, successful: boolean, response?: string): void {
        pathSnippetStoreState = {
            path: givenPath,
            snippet: null,
        };

        const expectedMessage = {
            path: [givenPath],
        };

        if (successful) {
            elementFinderMock
                .setup(finder => finder.processRequest(It.isValue(expectedMessage)))
                .returns(() => Promise.resolve(response))
                .verifiable(Times.once());
        } else {
            elementFinderMock
                .setup(finder => finder.processRequest(It.isValue(expectedMessage)))
                .returns(null)
                .verifiable(Times.once());
        }
    }

    function listenAndVerify(): void {
        pathSnippetStoreMock.verifyAll();
        elementFinderMock.verifyAll();
        addCorrespondingSnippetMock.verifyAll();
    }
});
