// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock } from 'typemoq';

import { DeviceConnectViewRenderer } from '../../../../electron/device-connect-view/device-connect-view-renderer';

describe('DetailsViewRendererTest', () => {
    test('render', () => {
        const dom = document.createElement('div');
        const deviceConnectViewContainer = document.createElement('div');
        const renderMock: IMock<typeof ReactDOM.render> = Mock.ofInstance(() => null);

        deviceConnectViewContainer.setAttribute('id', 'device-connect-view-container');
        dom.appendChild(deviceConnectViewContainer);

        renderMock
            .setup(r =>
                r(
                    It.isValue(
                        <>
                            <h1>Welcome to Accessibility Insights for Mobile</h1>
                        </>,
                    ),
                    deviceConnectViewContainer,
                ),
            )
            .verifiable();

        const renderer = new DeviceConnectViewRenderer(renderMock.object, dom);

        renderer.render();

        renderMock.verifyAll();
    });
});
