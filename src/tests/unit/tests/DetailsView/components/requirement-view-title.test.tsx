// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GuidanceTags } from 'common/components/guidance-tags';
import {
    RequirementViewTitle,
    RequirementViewTitleDeps,
    RequirementViewTitleProps,
} from 'DetailsView/components/requirement-view-title';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';

describe('RequirementViewTitleTest', () => {
    let props: RequirementViewTitleProps;
    beforeEach(() => {
        props = {
            deps: {} as RequirementViewTitleDeps,
            name: 'test-requirement-name',
            guidanceLinks: [{ href: 'test-guidance-href', text: 'test-guidance-text' }],
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
            shouldShowInfoButton: true,
        };
    });

    it('renders content from props', () => {
        const rendered = shallow(<RequirementViewTitle {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('renders content with info button and guidance tags when props.shouldShowInfoButton is true', () => {
        const rendered = shallow(<RequirementViewTitle {...props} />);
        expect(rendered.find(GuidanceTags).prop('links')).toBe(props.guidanceLinks);
        expect(rendered.find(ContentPanelButton).prop('reference')).toBe(props.infoAndExamples);
    });

    it('renders content without info button and guidance tags when props.shouldShowInfoButton is false', () => {
        props.shouldShowInfoButton = false;
        const rendered = shallow(<RequirementViewTitle {...props} />);
        expect(rendered.find(GuidanceTags).isEmptyRender()).toBe(true);
        expect(rendered.find(ContentPanelButton).isEmptyRender()).toBe(true);
    });
});
