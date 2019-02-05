// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Theme, ThemeDeps } from '../../common/components/theme';
import { config } from '../../common/configuration';
import { DocumentManipulator } from '../../common/document-manipulator';
import { Router, RouterDeps } from './router';

export type RendererDeps = {
    dom: Node & NodeSelector;
    render: ReactDOM.Renderer;
    initializeFabricIcons: () => void;
} & RouterDeps & ThemeDeps;

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
