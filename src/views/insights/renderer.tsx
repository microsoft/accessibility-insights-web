// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Theme, ThemeDeps } from 'common/components/theme';
import { config } from 'common/configuration';
import { DocumentManipulator } from 'common/document-manipulator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { InsightsRouter, ContentRouteDeps } from './insights-router';

export type RendererDeps = {
    dom: Document;
    render: ReactDOM.Renderer;
    initializeFabricIcons: () => void;
} & ContentRouteDeps &
    ThemeDeps;

export function renderer(deps: RendererDeps): void {
    const { dom, render, initializeFabricIcons } = deps;
    const iconPath = '../' + config.getOption('icon128');
    const documentElementSetter = new DocumentManipulator(dom);
    documentElementSetter.setShortcutIcon(iconPath);

    initializeFabricIcons();

    const insightsRoot = dom.querySelector('#insights-root');
    render(
        <>
            <Theme deps={deps} children={<InsightsRouter deps={deps} />} />
        </>,
        insightsRoot,
    );
}
