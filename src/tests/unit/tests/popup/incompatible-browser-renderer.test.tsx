// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createRoot } from 'react-dom/client';
import { Mock } from 'typemoq';

import { IncompatibleBrowserRenderer } from '../../../../popup/incompatible-browser-renderer';
import { TestDocumentCreator } from '../../common/test-document-creator';

describe('IncompatibleBrowserRenderer', () => {
    it('renders', () => {
        const renderMock = Mock.ofType<createRoot>();

        const fakeDocument = TestDocumentCreator.createTestDocument(
            '<div id="popup-container"></div>',
        );
        renderMock
            .setup(mock => mock(fakeDocument.getElementById('popup-container')))
            .callback(element => {
                expect(element).toMatchSnapshot();
            }).returns(jest.fn(createRoot))
            .verifiable();

        const testSubject = new IncompatibleBrowserRenderer(renderMock.object, fakeDocument);
        testSubject.render();

        renderMock.verifyAll();
    });
});
