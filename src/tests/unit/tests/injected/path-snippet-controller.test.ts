// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { PathSnippetStore } from '../../../../background/stores/path-snippet-store';
import { PathSnippetStoreData } from '../../../../common/types/store-data/path-snippet-store-data';
import { PathSnippetController } from '../../../../injected/path-snippet-controller';

describe('InspectControllerTests', () => {
    let pathSnippetStoreMock: IMock<PathSnippetStore>;
    let pathSnippetStoreState: PathSnippetStoreData;
    let addCorrespondingSnippetMock: IMock<(snippet: string) => void>;
    let testObject: PathSnippetController;

    beforeEach(() => {
        pathSnippetStoreMock = Mock.ofType(PathSnippetStore);
        addCorrespondingSnippetMock = Mock.ofInstance((snippet: string) => {});

        testObject = new PathSnippetController(pathSnippetStoreMock.object, null, addCorrespondingSnippetMock.object);

        pathSnippetStoreMock.setup(sm => sm.addChangedListener(It.is(isFunction)));
        pathSnippetStoreMock.setup(sm => sm.getState()).returns(() => pathSnippetStoreState);
    });

    afterEach(() => {
        pathSnippetStoreState = {
            path: '',
            snippet: '',
        };
    });

    test('do not add snippet if path snippet store state is null', () => {
        pathSnippetStoreState = null;

        testObject.listenToStore();

        listenAndVerify();
    });

    test('call add snippet if path snippet store state has changed', () => {
        const givenPath = 'test path';
        const retrievedSnippet = 'Retrieved Snippet from Store for Path: ' + givenPath;

        pathSnippetStoreState = {
            path: givenPath,
            snippet: '',
        };

        addCorrespondingSnippetMock.setup(sm => sm(retrievedSnippet)).verifiable(Times.once());

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

    function listenAndVerify(): void {
        pathSnippetStoreMock.verifyAll();
        addCorrespondingSnippetMock.verifyAll();
    }
});
