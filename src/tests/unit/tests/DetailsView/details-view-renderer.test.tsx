// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configMutator } from 'common/configuration';
import { DocumentManipulator } from 'common/document-manipulator';
import { DetailsViewRenderer, DetailsViewRendererDeps } from 'DetailsView/details-view-renderer';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { It, Mock } from 'typemoq';
import { Theme } from '../../../../common/components/theme';
import { DetailsView } from '../../../../DetailsView/details-view-container';
import { TestDocumentCreator } from '../../common/test-document-creator';

describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const deps = Mock.ofType<DetailsViewRendererDeps>().object;

        const fakeDocument = TestDocumentCreator.createTestDocument(
            '<div id="details-container"></div>',
        );

        const rootMock = Mock.ofType<Root>();
        const createRootMock = Mock.ofType<typeof createRoot>();

        const expectedIcon16 = 'icon128.png';
        configMutator.setOption('icon128', expectedIcon16);
        const documentManipulatorMock = Mock.ofType(DocumentManipulator);
        documentManipulatorMock
            .setup(des => des.setShortcutIcon('../' + expectedIcon16))
            .verifiable();

        createRootMock
            .setup(r => r(fakeDocument.getElementById('details-container')))
            .returns(() => {
                return rootMock.object;
            })
            .verifiable();

        rootMock
            .setup(r =>
                r.render(
                    It.isValue(
                        <>
                            <Theme deps={deps} />
                            <DetailsView deps={deps} />
                        </>,
                    ),
                ),
            )
            .verifiable();

        const renderer = new DetailsViewRenderer(
            deps,
            fakeDocument,
            createRootMock.object,
            documentManipulatorMock.object,
        );

        renderer.render();

        createRootMock.verifyAll();
        rootMock.verifyAll();
        documentManipulatorMock.verifyAll();
    });
});
