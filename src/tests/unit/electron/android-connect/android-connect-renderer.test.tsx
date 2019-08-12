// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';

import { AndroidConnectRenderer } from '../../../../electron/android-connect/android-connect-renderer';

describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const dom = document.createElement('div');
        const androidConnectContainer = document.createElement('div');
        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);

        androidConnectContainer.setAttribute('id', 'android-connect-container');
        dom.appendChild(androidConnectContainer);

        renderMock
            .setup(r =>
                r(
                    It.isValue(
                        <>
                            <h1>Hello, Android</h1>
                        </>,
                    ),
                    androidConnectContainer,
                ),
            )
            .verifiable();

        const renderer = new AndroidConnectRenderer(renderMock.object, dom);

        renderer.render();

        renderMock.verifyAll();
    });
});
