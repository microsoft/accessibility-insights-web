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

export type RendererDeps = {
    dom: Node & NodeSelector;
    render: ReactDOM.Renderer;
    initializeFabricIcons: () => void;
    userConfigurationStore: IBaseStore<UserConfigurationStoreData>;
} & RouterDeps;

export function renderer(deps: RendererDeps = rendererDependencies) {
    const { dom, render, initializeFabricIcons, userConfigurationStore } = deps;
    const iconPath = '../' + config.getOption('icon16');
    const documentElementSetter = new DocumentManipulator(dom);
    documentElementSetter.setShortcutIcon(iconPath);

    deps.contentActionMessageCreator.getUserConfig();
    initializeFabricIcons();

    const insightsRoot = dom.querySelector('#insights-root');
    render(
        <><Theme userConfigurationStore={userConfigurationStore} /><Router deps={deps} /></>,
        insightsRoot,
    );
}
