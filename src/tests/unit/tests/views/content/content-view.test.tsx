// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { NarrowModeDetector } from 'DetailsView/components/narrow-mode-detector';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

import { ContentView, ContentViewDeps } from 'views/content/content-view';
jest.mock('DetailsView/components/narrow-mode-detector');
describe('content view', () => {
    mockReactComponents([NarrowModeDetector]);

    it('renders', () => {
        const applicationTitle = 'THE_APPLICATION_TITLE';
        const deps = {
            textContent: {
                applicationTitle,
            },
        } as ContentViewDeps;

        const component = (
            <ContentView deps={deps}>
                <p>THE CONTENT</p>
            </ContentView>
        );

        const renderResult = render(component);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
