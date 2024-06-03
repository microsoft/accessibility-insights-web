// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Theme } from 'common/components/theme';
import { configMutator } from 'common/configuration';
import { DocumentManipulator } from 'common/document-manipulator';
import { DetailsView } from 'DetailsView/details-view-container';
import { DetailsViewRenderer, DetailsViewRendererDeps } from 'DetailsView/details-view-renderer';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';
import { TestDocumentCreator } from '../../common/test-document-creator';

describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const deps = Mock.ofType<DetailsViewRendererDeps>().object;

        const fakeDocument = TestDocumentCreator.createTestDocument(
            '<div id="details-container"></div>',
        );

        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);

        const expectedIcon16 = 'icon128.png';
        configMutator.setOption('icon128', expectedIcon16);
        const documentManipulatorMock = Mock.ofType(DocumentManipulator);
        documentManipulatorMock
            .setup(des => des.setShortcutIcon('../' + expectedIcon16))
            .verifiable();

        renderMock
            .setup(r =>
                r(
                    It.isValue(
                        <>
                            <Theme deps={deps}>
                                <DetailsView deps={deps} />
                            </Theme>
                        </>,
                    ),
                    fakeDocument.getElementById('details-container'),
                ),
            )
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
