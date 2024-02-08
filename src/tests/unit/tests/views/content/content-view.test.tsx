// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

import { ContentView, ContentViewDeps } from 'views/content/content-view';
import { Page } from 'views/page/page';

jest.mock('views/page/page');
describe('content view', () => {
    mockReactComponents([Page]);

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
