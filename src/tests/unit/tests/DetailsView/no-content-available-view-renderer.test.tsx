// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configMutator } from 'common/configuration';
import { DocumentManipulator } from 'common/document-manipulator';
import {
    NoContentAvailableViewDeps,
} from 'DetailsView/components/no-content-available/no-content-available-view';
import { NoContentAvailableViewRenderer } from 'DetailsView/no-content-available-view-renderer';
import { createRoot } from 'react-dom/client';
import { TestDocumentCreator } from 'tests/unit/common/test-document-creator';
import { Mock } from 'typemoq';

jest.mock('react-resize-detector');

describe('NoContentAvailableViewRenderer', () => {
    it('renders', () => {
        const deps = Mock.ofType<NoContentAvailableViewDeps>().object;

        const fakeDocument = TestDocumentCreator.createTestDocument(
            '<div id="details-container"></div>',
        );

        const expectedIcon16 = 'icon128.png';
        configMutator.setOption('icon128', expectedIcon16);
        const documentManipulatorMock = Mock.ofType<DocumentManipulator>();
        documentManipulatorMock
            .setup(des => des.setShortcutIcon('../' + expectedIcon16))
            .verifiable();

        const renderMock = Mock.ofType<createRoot>();
        const createRootMock = jest.fn(createRoot);
        renderMock.setup(r =>
            r(
                fakeDocument.getElementById('details-container')
            ),
        ).returns(createRootMock);

        const testSubject = new NoContentAvailableViewRenderer(
            deps,
            fakeDocument,
            renderMock.object,
            documentManipulatorMock.object,
        );

        testSubject.render();

        renderMock.verifyAll();
        documentManipulatorMock.verifyAll();
    });
});
