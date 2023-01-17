// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RequirementContextSection,
    RequirementContextSectionDeps,
    RequirementContextSectionProps,
} from 'DetailsView/components/requirement-context-section';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPage, ContentPageComponent } from 'views/content/content-page';

describe('RequirementContextSectionTest', () => {
    let props: RequirementContextSectionProps;
    beforeEach(() => {
        props = {
            deps: {} as RequirementContextSectionDeps,
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
            whyItMatters: ContentPage.create(() => <p>WHY IT MATTERS CONTENT FOR TESTING'</p>),
        };
    });

    it('renders content from props', () => {
        const rendered = shallow(<RequirementContextSection {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders with helpfulResourceLinks', () => {
        props.helpfulResourceLinks = [{ href: 'test-guidance-href', text: 'test-guidance-text' }];
        const rendered = shallow(<RequirementContextSection {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
