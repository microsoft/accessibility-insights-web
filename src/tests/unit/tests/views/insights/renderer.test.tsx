// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { configMutator } from 'common/configuration';
import { createRoot } from 'react-dom/client';
import { renderer, RendererDeps } from 'views/insights/renderer';

jest.mock('../../../../../common/components/body-class-modifier');
jest.mock('common/components/theme');
describe('insights renderer', () => {
    const deps = {
        dom: document,
        render: jest.fn(createRoot),
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

    it('renders InsightsRouter', () => {
        renderer(deps);
        const root = document.body.querySelector('#insights-root');
        //NEEDS TO REVISIT AS PART OF REACT18 changes
        expect(deps.render).toHaveBeenCalledWith(root);
    });
});
