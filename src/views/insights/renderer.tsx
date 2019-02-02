// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ControlledBodyClassNameState, Theme } from '../../common/components/theme';
import { StoreSubscriberDeps } from '../../common/components/with-store-subscription';
import { config } from '../../common/configuration';
import { DocumentManipulator } from '../../common/document-manipulator';
import { rendererDependencies } from './dependencies';
import { Router, RouterDeps } from './router';

export type RendererDeps = {
    dom: Node & NodeSelector;
    render: ReactDOM.Renderer;
    initializeFabricIcons: () => void;
} & RouterDeps &
    StoreSubscriberDeps<ControlledBodyClassNameState>;

export function renderer(deps: RendererDeps): void {
    const { dom, render, initializeFabricIcons } = deps;
    const iconPath = '../' + config.getOption('icon16');
    const documentElementSetter = new DocumentManipulator(dom);
    documentElementSetter.setShortcutIcon(iconPath);

    initializeFabricIcons();

    const insightsRoot = dom.querySelector('#insights-root');
    render(
        <>
            <Theme deps={deps} />
            <Router deps={deps} />
        </>,
        insightsRoot,
    );
}
