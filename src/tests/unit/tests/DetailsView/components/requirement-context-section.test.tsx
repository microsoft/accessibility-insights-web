// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { HelpLinks } from 'DetailsView/components/help-links';
import {
    RequirementContextSection,
    RequirementContextSectionDeps,
    RequirementContextSectionProps,
} from 'DetailsView/components/requirement-context-section';
import * as React from 'react';
import { ContentPage, ContentPageComponent } from 'views/content/content-page';
import { ContentPanelButton } from 'views/content/content-panel-button';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('views/content/content-panel-button');
jest.mock('DetailsView/components/help-links');

describe('RequirementContextSectionTest', () => {
    let props: RequirementContextSectionProps;
    beforeEach(() => {
        mockReactComponents([ContentPanelButton, HelpLinks]);
        props = {
            deps: {} as RequirementContextSectionDeps,
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
            whyItMatters: ContentPage.create(() => <p>WHY IT MATTERS CONTENT FOR TESTING'</p>),
        };
    });

    it('renders content from props', () => {
        const renderResult = render(<RequirementContextSection {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ContentPanelButton, HelpLinks]);
    });

    it('renders with helpfulResourceLinks', () => {
        props.helpfulResourceLinks = [{ href: 'test-guidance-href', text: 'test-guidance-text' }];
        const renderResult = render(<RequirementContextSection {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ContentPanelButton, HelpLinks]);
    });
});
