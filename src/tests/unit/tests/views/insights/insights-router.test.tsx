// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { mount } from 'enzyme';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ContentRouteDeps, InsightsRoutes } from 'views/insights/insights-router';

const StubContentRootComponent = NamedFC('StubContentRoot', () => <p>Stub content</p>);

describe('InsightsRoutes', () => {
    const deps: ContentRouteDeps = {
        ContentRootComponent: StubContentRootComponent,
    } as ContentRouteDeps;

    it('renders /content/ route with Content component for correct reference', () => {
        const result = mount(
            <MemoryRouter initialEntries={['/content/the/content/path']}>
                <InsightsRoutes deps={deps} />
            </MemoryRouter>,
        );

        const contentRootComponent = result.find(StubContentRootComponent);
        expect(contentRootComponent).toHaveLength(1);

        expect(contentRootComponent.prop('deps')).toBe(deps);
        expect(contentRootComponent.prop('reference')).toBe('the/content/path');
    });
});
