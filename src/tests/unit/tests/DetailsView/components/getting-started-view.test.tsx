// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessment } from 'assessments/types/iassessment';
import { VisualizationType } from 'common/types/visualization-type';
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
            assessment: {
                gettingStarted: <div>test-getting-started-content</div>,
                title: 'some title',
                guidance: { pageTitle: 'some page title' } as ContentPageComponent,
                visualizationType: -1 as VisualizationType,
                requirements: [
                    { key: 'expectedNextRequirement' },
                    { key: 'shouldntAppearInSnapshots' },
                ],
            } as Assessment,
        };
    });

    it('renders with content from props', () => {
        const rendered = shallow(<GettingStartedView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
