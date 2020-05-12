// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RequirementViewTitle,
    RequirementViewTitleDeps,
    RequirementViewTitleProps,
} from 'DetailsView/components/requirement-view-title';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';

describe('RequirementViewTitleTest', () => {
    it('renders with content from props', () => {
        const props: RequirementViewTitleProps = {
            deps: {} as RequirementViewTitleDeps,
            name: 'test-requirement-name',
            guidanceLinks: [{ href: 'test-guidance-href', text: 'test-guidance-text' }],
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
        };

        const rendered = shallow(<RequirementViewTitle {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
