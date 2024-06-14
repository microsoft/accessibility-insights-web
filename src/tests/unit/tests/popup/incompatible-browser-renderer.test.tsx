// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Root, createRoot } from 'react-dom/client';
import { It, Mock } from 'typemoq';

import { IncompatibleBrowserRenderer } from '../../../../popup/incompatible-browser-renderer';

describe('IncompatibleBrowserRenderer', () => {
    it('renders', () => {
        const containerMock = Mock.ofType<HTMLElement>();
        const documentMock = Mock.ofType<Document>();
        documentMock
            .setup(mock => mock.querySelector('#popup-container'))
            .returns(() => containerMock.object);
        const rootMock = Mock.ofType<Root>();
        const createRootMock = Mock.ofType<typeof createRoot>();
        createRootMock
            .setup(r => r(containerMock.object))
            .returns(() => {
                return rootMock.object;
            });
        rootMock
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

        createRootMock.verifyAll();
        rootMock.verifyAll();
    });
});
