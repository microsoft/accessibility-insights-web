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
    let addCorrespondingSnippetMock: IMock<(snippet: string) => void>;

    beforeEach(() => {
        pathSnippetStoreMock = Mock.ofType(PathSnippetStore);
        pathSnippetStoreMock.setup(sm => sm.addChangedListener(It.is(isFunction)));
        pathSnippetStoreMock.setup(sm => sm.getState()).returns(() => pathSnippetStoreState);

        elementFinderMock = Mock.ofType(ElementFinderByPath);

        addCorrespondingSnippetMock = Mock.ofInstance((snippet: string) => {});

        testObject = new PathSnippetController(
            pathSnippetStoreMock.object,
            elementFinderMock.object,
            addCorrespondingSnippetMock.object,
        );
    });

    afterEach(() => {
        pathSnippetStoreState = {
            path: null,
            snippet: null,
        };
    });

    test('do not add snippet if path snippet store state is null', async () => {
        pathSnippetStoreState = null;
        addCorrespondingSnippetMock.setup(sm => sm(It.isAnyString())).verifiable(Times.never());

        await testObject.listenToStore();

        listenAndVerify();
    });

    test('do not add snippet if path is null', async () => {
        pathSnippetStoreState = {
            path: null,
            snippet: null,
        };
        addCorrespondingSnippetMock.setup(sm => sm(It.isAnyString())).verifiable(Times.never());

        await testObject.listenToStore();

        listenAndVerify();
    });

    test('call add snippet if path snippet store state has changed', async () => {
        const givenPath = '.test path';
        const retrievedSnippet = '<test snippet>';

        pathSnippetStoreState = {
            path: givenPath,
            snippet: null,
        };

        elementFinderMock
            .setup(finder => finder.processRequest({ path: [givenPath] }))
            .returns(() => Promise.resolve({ payload: retrievedSnippet }))
            .verifiable(Times.once());
        addCorrespondingSnippetMock.setup(sm => sm(retrievedSnippet)).verifiable(Times.once());

        await testObject.listenToStore();

        listenAndVerify();
    });

    test('add failure message if no snippet found', async () => {
        const givenPath = '.test path';
        const errorMessage = 'No code snippet is mapped to: ' + givenPath;

        pathSnippetStoreState = {
            path: givenPath,
            snippet: null,
        };

        const expectedMessage = {
            path: [givenPath],
        };

        elementFinderMock
            .setup(finder => finder.processRequest(expectedMessage))
            .returns(() => Promise.reject())
            .verifiable(Times.once());
        addCorrespondingSnippetMock.setup(sm => sm(errorMessage)).verifiable(Times.once());

        await testObject.listenToStore();

        listenAndVerify();
    });

    test("don't call add snippet if path snippet store state has empty path", async () => {
        const givenPath = '';

        pathSnippetStoreState = {
            path: givenPath,
            snippet: '',
        };

        await testObject.listenToStore();

        listenAndVerify();
    });

    function listenAndVerify(): void {
        pathSnippetStoreMock.verifyAll();
        elementFinderMock.verifyAll();
        addCorrespondingSnippetMock.verifyAll();
    }
});
