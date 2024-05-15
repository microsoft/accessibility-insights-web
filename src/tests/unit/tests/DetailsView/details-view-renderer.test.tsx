// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configMutator } from 'common/configuration';
import { DocumentManipulator } from 'common/document-manipulator';
import { DetailsViewRenderer, DetailsViewRendererDeps } from 'DetailsView/details-view-renderer';
import { createRoot } from 'react-dom/client';
import { IMock, Mock } from 'typemoq';
import { TestDocumentCreator } from '../../common/test-document-creator';

jest.mock('DetailsView/details-view-container');
jest.mock('common/components/theme');
describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const deps = Mock.ofType<DetailsViewRendererDeps>().object;

        const fakeDocument = TestDocumentCreator.createTestDocument(
            '<div id="details-container"></div>',
        );

        const renderMock: IMock<typeof createRoot> = Mock.ofInstance(() => null);
        const createRootMock = jest.fn(createRoot);

        const expectedIcon16 = 'icon128.png';
        configMutator.setOption('icon128', expectedIcon16);
        const documentManipulatorMock = Mock.ofType(DocumentManipulator);
        documentManipulatorMock
            .setup(des => des.setShortcutIcon('../' + expectedIcon16))
            .verifiable();

        renderMock
            .setup(r => r(fakeDocument.getElementById('details-container')))
            .returns(createRootMock)
            .verifiable();

        const renderer = new DetailsViewRenderer(
            deps,
            fakeDocument,
            renderMock.object,
            documentManipulatorMock.object,
        );

        renderer.render();

        renderMock.verifyAll();
        documentManipulatorMock.verifyAll();
    });
});
