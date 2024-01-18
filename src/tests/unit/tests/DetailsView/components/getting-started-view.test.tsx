// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { Assessment } from 'assessments/types/iassessment';
import { VisualizationType } from 'common/types/visualization-type';
import {
    GettingStartedView,
    GettingStartedViewDeps,
    GettingStartedViewProps,
} from 'DetailsView/components/getting-started-view';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentLink } from '../../../../../views/content/content-link';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../views/content/content-link');

describe('GettingStartedViewTest', () => {
    mockReactComponents([ContentLink]);
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
        const renderResult = render(<GettingStartedView {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
