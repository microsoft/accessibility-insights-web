// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { renderer, RendererDeps } from 'views/insights/renderer';
import { Router } from 'views/insights/router';
import { Theme } from '../../../../../common/components/theme';
import { configMutator } from '../../../../../common/configuration';

describe('insights renderer', () => {
    const deps = {
        dom: document,
        render: jest.fn(),
        initializeFabricIcons: jest.fn(),
    } as Partial<RendererDeps> as RendererDeps;

    beforeEach(() => {
        document.head.innerHTML =
            '<link rel="shortcut icon" type="image/x-icon" href="../old-icon.png" />';
        document.body.innerHTML = '<div id="insights-root" />';

        configMutator.setOption('icon128', 'new-icon.png');
    });

    it('sets icon as configured', () => {
        renderer(deps);
        expect(document.querySelector('link').getAttribute('href')).toEqual('../new-icon.png');
    });

    it('calls initializeFabricIcons', () => {
        renderer(deps);
        expect(deps.initializeFabricIcons).toHaveBeenCalledTimes(1);
    });

    it('renders Router', () => {
        renderer(deps);
        const root = document.body.querySelector('#insights-root');
        expect(deps.render).toHaveBeenCalledWith(
            <>
                <Theme deps={deps} />
                <Router deps={deps} />
            </>,
            root,
        );
    });
});
