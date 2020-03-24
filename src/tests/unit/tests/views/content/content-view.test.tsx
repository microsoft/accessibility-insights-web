// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ContentView, ContentViewDeps } from 'views/content/content-view';

describe('content view', () => {
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
        const result = shallow(component);

        expect(result.getElement()).toMatchSnapshot();
    });
});
