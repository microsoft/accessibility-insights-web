// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ReactDOM from 'react-dom';
import { It, Mock } from 'typemoq';

import { IncompatibleBrowserRenderer } from '../../../../popup/incompatible-browser-renderer';

describe('IncompatibleBrowserRenderer', () => {
    it('render', () => {
        const renderMock = Mock.ofType<typeof ReactDOM.render>();
        const containerStub = Mock.ofType<HTMLElement>();
        const documentMock = Mock.ofType<NodeSelector & Node>();

        documentMock.setup(mock => mock.querySelector('#popup-container')).returns(() => containerStub.object);

        renderMock
            .setup(mock => mock(It.isAny(), containerStub.object))
            .callback(element => {
                expect(element).toMatchSnapshot();
            })
            .verifiable();

        const testSubject = new IncompatibleBrowserRenderer(renderMock.object, documentMock.object);
        testSubject.render();

        renderMock.verifyAll();
    });
});
