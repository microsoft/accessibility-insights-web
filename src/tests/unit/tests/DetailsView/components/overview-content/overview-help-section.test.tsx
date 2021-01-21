// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import {
    OverviewHelpSection,
    OverviewHelpSectionDeps,
    OverviewHelpSectionProps,
} from 'DetailsView/components/overview-content/overview-help-section';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('OverviewHelpSection', () => {
    test('help text is shown properly', () => {
        const props: OverviewHelpSectionProps = {
            linkDataSource: [] as HyperlinkDefinition[],
            deps: {} as OverviewHelpSectionDeps,
        };
        const wrapper = shallow(<OverviewHelpSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
