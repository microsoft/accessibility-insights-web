// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { configMutator } from '../../../../../common/configuration';
import { renderer, RendererDeps } from '../../../../../views/insights/renderer';
import { Router } from '../../../../../views/insights/router';
import { UserConfigurationStore } from '../../../../../background/stores/global/user-configuration-store';
import { Mock } from 'typemoq';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { Theme } from '../../../../../common/components/theme';

describe('insights renderer', () => {
    const userConfigurationStoreMock = Mock.ofType(UserConfigurationStore);
    const contentActionMessageCreatorMock = Mock.ofType(ContentActionMessageCreator);
    const deps = ({
        dom: document,
        render: jest.fn<ReactDOM.Renderer>(),
        initializeFabricIcons: jest.fn(),
        userConfigurationStore: userConfigurationStoreMock.object,
        contentActionMessageCreator: contentActionMessageCreatorMock.object,
    } as Partial<RendererDeps>) as RendererDeps;

    beforeEach(() => {
        document.head.innerHTML = '<link rel="shortcut icon" type="image/x-icon" href="../old-icon.png" />';
        document.body.innerHTML = '<div id="insights-root" />';

        configMutator.setOption('icon16', 'new-icon.png');
        contentActionMessageCreatorMock.setup(c => c.getUserConfig()).verifiable();
    });

    it('sets icon as configured', () => {
        renderer(deps, userConfigurationStoreMock.object);
        expect(document.querySelector('link').getAttribute('href')).toEqual('../new-icon.png');
    });

    it('calls initializeFabricIcons', () => {
        renderer(deps, userConfigurationStoreMock.object);
        expect(deps.initializeFabricIcons).toHaveBeenCalledTimes(1);
    });

    it('renders Router', () => {
        renderer(deps, userConfigurationStoreMock.object);
        const root = document.body.querySelector('#insights-root');
        expect(deps.render).toHaveBeenCalledWith(
            <>
                <Theme userConfigurationStore={userConfigurationStoreMock.object} />
                <Router deps={deps} />
            </>,
            root,
        );
    });
});
