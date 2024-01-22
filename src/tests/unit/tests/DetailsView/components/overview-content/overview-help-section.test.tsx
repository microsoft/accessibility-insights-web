// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import {
    OverviewHelpSection,
    OverviewHelpSectionDeps,
    OverviewHelpSectionProps,
} from 'DetailsView/components/overview-content/overview-help-section';
import * as React from 'react';
import { HelpLinks } from '../../../../../../DetailsView/components/help-links';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../DetailsView/components/help-links');
describe('OverviewHelpSection', () => {
    mockReactComponents([HelpLinks]);
    test('help text is shown properly', () => {
        const props: OverviewHelpSectionProps = {
            linkDataSource: [] as HyperlinkDefinition[],
            deps: {} as OverviewHelpSectionDeps,
            getAboutComponent: () => <div>ABOUT OVERVIEW</div>,
        };
        const renderResult = render(<OverviewHelpSection {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
