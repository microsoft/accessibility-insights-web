// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import ReactDOM from 'react-dom';
import { It, Mock } from 'typemoq';

import { IncompatibleBrowserRenderer } from '../../../../popup/incompatible-browser-renderer';

describe('IncompatibleBrowserRenderer', () => {
    it('renders', () => {
        const renderMock = Mock.ofType<typeof ReactDOM.render>();
        const containerMock = Mock.ofType<HTMLElement>();
        const documentMock = Mock.ofType<Document>();

        documentMock
            .setup(mock => mock.querySelector('#popup-container'))
            .returns(() => containerMock.object);

        renderMock
            .setup(mock => mock(It.isAny(), containerMock.object))
            .callback(element => {
                expect(element).toMatchSnapshot();
            })
            .verifiable();

        const testSubject = new IncompatibleBrowserRenderer(renderMock.object, documentMock.object);
        testSubject.render();

        renderMock.verifyAll();
    });
});
