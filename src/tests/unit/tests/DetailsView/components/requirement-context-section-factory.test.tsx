// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { RequirementContextSectionDeps } from 'DetailsView/components/requirement-context-section';
import {
    RequirementContextSectionFactoryProps,
    getRequirementContextSectionForAssessment,
    getRequirementContextSectionForQuickAssess,
} from 'DetailsView/components/requirement-view-context-section-factory';

import { shallow } from 'enzyme';
import { ContentPage, ContentPageComponent } from 'views/content/content-page';

describe('RequirementContextSectionFactoryTest', () => {
    let props: RequirementContextSectionFactoryProps;
    beforeEach(() => {
        props = {
            deps: {} as RequirementContextSectionDeps,
            className: 'test-class-name',
            assessmentKey: 'test-assessment-key',
            whyItMatters: ContentPage.create(() => 'WHY IT MATTERS' as any),
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
            helpfulResourceLinks: [{ href: 'test-resource-href', text: 'test-resource-text' }],
        };
    });

    describe('getRequirementContextSectionForAssessment', () => {
        it('returns null', () => {
            expect(getRequirementContextSectionForAssessment(props)).toBeNull();
        });
    });

    describe('getRequirementContextSectionForQuickAssess', () => {
        it('renders content from props', () => {
            const rendered = shallow(getRequirementContextSectionForQuickAssess(props));
            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('returns null if we are in Automated Checks', () => {
            props.assessmentKey = AutomatedChecks.key;
            expect(getRequirementContextSectionForQuickAssess(props)).toBeNull();
        });
    });
});
