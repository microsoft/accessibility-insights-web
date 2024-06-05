// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configMutator } from 'common/configuration';
import { DocumentManipulator } from 'common/document-manipulator';
import {
    NoContentAvailableView,
    NoContentAvailableViewDeps,
} from 'DetailsView/components/no-content-available/no-content-available-view';
import { NoContentAvailableViewRenderer } from 'DetailsView/no-content-available-view-renderer';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { TestDocumentCreator } from 'tests/unit/common/test-document-creator';
import { It, Mock } from 'typemoq';

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

        const renderMock: any = Mock.ofType<typeof createRoot>();
        const createRootMock: any = Mock.ofType<typeof createRoot>();
        createRootMock
            .setup(r => r(fakeDocument.getElementById('details-container')))
            .returns(() => {
                return renderMock.object;
            })
            .verifiable();

        renderMock
            .setup(r => r.render(It.isValue(<NoContentAvailableView deps={deps} />)))
            .verifiable();

        const testSubject = new NoContentAvailableViewRenderer(
            deps,
            fakeDocument,
            createRootMock.object,
            documentManipulatorMock.object,
        );

        testSubject.render();

        createRootMock.verifyAll();
        renderMock.verifyAll();
        documentManipulatorMock.verifyAll();
    });
});
