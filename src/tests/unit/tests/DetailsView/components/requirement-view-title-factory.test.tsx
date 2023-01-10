// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { GuidanceTags } from 'common/components/guidance-tags';
import {
    getRequirementViewTitleForAssessment,
    getRequirementViewTitleForQuickAssess,
    RequirementViewTitleDeps,
    RequirementViewTitleFactoryProps,
} from 'DetailsView/components/requirement-view-title-factory';
import { shallow } from 'enzyme';
import { ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';

describe('RequirementViewTitleFactoryTest', () => {
    let props: RequirementViewTitleFactoryProps;
    beforeEach(() => {
        props = {
            deps: {} as RequirementViewTitleDeps,
            requirementKey: 'test-requirement-key',
            name: 'test-requirement-name',
            guidanceLinks: [{ href: 'test-guidance-href', text: 'test-guidance-text' }],
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
        };
    });

    describe('getRequirementViewTitleForAssessment', () => {
        it('renders content from props', () => {
            const rendered = shallow(getRequirementViewTitleForAssessment(props));
            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('renders content with info button and guidance tags', () => {
            const rendered = shallow(getRequirementViewTitleForAssessment(props));
            expect(rendered.find(GuidanceTags).prop('links')).toBe(props.guidanceLinks);
            expect(rendered.find(ContentPanelButton).prop('reference')).toBe(props.infoAndExamples);
        });
    });

    describe('getRequirementViewTitleForQuickAssess', () => {
        it('renders content from props', () => {
            const rendered = shallow(getRequirementViewTitleForQuickAssess(props));
            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('renders content without info button and guidance tags', () => {
            const rendered = shallow(getRequirementViewTitleForQuickAssess(props));
            expect(rendered.find(GuidanceTags).isEmptyRender()).toBe(true);
            expect(rendered.find(ContentPanelButton).isEmptyRender()).toBe(true);
        });

        it('does render info button and guidance tags for automated checks', () => {
            props.requirementKey = AutomatedChecks.key;
            const rendered = shallow(getRequirementViewTitleForQuickAssess(props));
            expect(rendered.find(GuidanceTags).prop('links')).toBe(props.guidanceLinks);
            expect(rendered.find(ContentPanelButton).prop('reference')).toBe(props.infoAndExamples);
        });
    });
});
