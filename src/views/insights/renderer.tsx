// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { config } from '../../common/configuration';
import { DocumentManipulator } from '../../common/document-manipulator';
import { IBaseStore } from '../../common/istore';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { rendererDependencies } from './dependencies';
import { Router, RouterDeps } from './router';
import { Theme } from '../../common/components/theme';
import { StoreProxy } from '../../common/store-proxy';
import { StoreNames } from '../../common/stores/store-names';
import { ChromeAdapter } from '../../background/browser-adapter';

export type RendererDeps = {
    dom: Node & NodeSelector;
    render: ReactDOM.Renderer;
    initializeFabricIcons: () => void;
    chromeAdapter: ChromeAdapter;
} & RouterDeps;

export function renderer(deps: RendererDeps = rendererDependencies, userConfigurationStore?: IBaseStore<UserConfigurationStoreData>) {
    const { dom, render, initializeFabricIcons } = deps;
    const iconPath = '../' + config.getOption('icon16');
    const documentElementSetter = new DocumentManipulator(dom);
    documentElementSetter.setShortcutIcon(iconPath);

    deps.contentActionMessageCreator.getUserConfig();
    initializeFabricIcons();

    const insightsRoot = dom.querySelector('#insights-root');
    const store =
        userConfigurationStore ||
        new StoreProxy<UserConfigurationStoreData>(StoreNames[StoreNames.UserConfigurationStore], deps.chromeAdapter);
    render(
        <>
            <Theme userConfigurationStore={store} />
            <Router deps={deps} />
        </>,
        insightsRoot,
    );
}
