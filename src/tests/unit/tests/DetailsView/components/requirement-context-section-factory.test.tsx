// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { RequirementContextSectionDeps } from 'DetailsView/components/requirement-context-section';

import {
    RequirementContextSectionFactoryProps,
    getRequirementContextSectionForAssessment,
    getRequirementContextSectionForQuickAssess,
} from 'DetailsView/components/requirement-view-context-section-factory';
import { ContentPage, ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('views/content/content-panel-button');
describe('RequirementContextSectionFactoryTest', () => {
    let props: RequirementContextSectionFactoryProps;
    beforeEach(() => {
        mockReactComponents([ContentPanelButton]);
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
            const renderResult = render(getRequirementContextSectionForQuickAssess(props));
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('returns null if we are in Automated Checks', () => {
            props.assessmentKey = AutomatedChecks.key;
            expect(getRequirementContextSectionForQuickAssess(props)).toBeNull();
        });
    });
});
