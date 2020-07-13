// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import {
    GettingStartedView,
    GettingStartedViewDeps,
    GettingStartedViewProps,
} from 'DetailsView/components/getting-started-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';

describe('GettingStartedViewTest', () => {
    let props: GettingStartedViewProps;

    beforeEach(() => {
        props = {
            deps: {} as GettingStartedViewDeps,
            gettingStartedContent: <div>test-getting-started-content</div>,
            title: 'some title',
            guidance: { pageTitle: 'some page title' } as ContentPageComponent,
            nextRequirement: {
                key: 'some requirement key',
            } as Requirement,
            currentTest: -1,
        };
    });

    it('renders with content from props', () => {
        const rendered = shallow(<GettingStartedView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
