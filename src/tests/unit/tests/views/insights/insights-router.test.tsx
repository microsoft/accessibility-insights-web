// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Content } from 'views/content/content';
import { ContentRouteDeps, InsightsRoutes } from 'views/insights/insights-router';

jest.mock('views/content/content');

describe('InsightsRoutes', () => {
    mockReactComponents([Content]);
    const deps: ContentRouteDeps = {
        ContentRootComponent: Content,
    } as ContentRouteDeps;

    it('renders /content/ route with Content component for correct reference', () => {
        render(
            <MemoryRouter initialEntries={['/content/the/content/path']}>
                <InsightsRoutes deps={deps} />
            </MemoryRouter>,
        );
        const contentRootComponent = getMockComponentClassPropsForCall(Content);
        expect(contentRootComponent).not.toBeNull();

        expect(contentRootComponent.deps).toBe(deps);
        expect(contentRootComponent.reference).toBe('the/content/path');
    });
});
