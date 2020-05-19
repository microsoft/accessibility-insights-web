// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    GettingStartedView,
    GettingStartedViewDeps,
    GettingStartedViewProps,
} from 'DetailsView/components/getting-started-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';

describe('GettingStartedViewTest', () => {
    it('renders with content from props', () => {
        const props: GettingStartedViewProps = {
            deps: {} as GettingStartedViewDeps,
            gettingStartedContent: <div>test-getting-started-content</div>,
            title: 'some title',
            guidance: { pageTitle: 'some page title' } as ContentPageComponent,
        };

        const rendered = shallow(<GettingStartedView {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
