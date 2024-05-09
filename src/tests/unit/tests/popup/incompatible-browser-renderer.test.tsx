// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createRoot } from 'react-dom/client';
import { It, Mock } from 'typemoq';

import { IncompatibleBrowserRenderer } from '../../../../popup/incompatible-browser-renderer';

describe('IncompatibleBrowserRenderer', () => {
    it('renders', () => {
        const createRootMock: any = Mock.ofType<typeof createRoot>();
        const containerMock = Mock.ofType<HTMLElement>();
        const documentMock = Mock.ofType<Document>();
        documentMock
            .setup(mock => mock.querySelector('#popup-container'))
            .returns(() => containerMock.object);
        const renderMock: any = Mock.ofType<typeof createRoot>();
        createRootMock
            .setup(r => r(It.isAny()))
            .returns(() => {
                return renderMock.object;
            });
        renderMock
            .setup(mock => mock.render(It.isAny()))
            .callback(element => {
                expect(element).toMatchSnapshot();
            })
            .verifiable();

        const testSubject = new IncompatibleBrowserRenderer(
            createRootMock.object,
            documentMock.object,
        );
        testSubject.render();

        renderMock.verifyAll();
    });
});
