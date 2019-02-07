// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import {
    HelpLinkDeps,
    OverviewHelpProps,
    OverviewHelpSection,
} from '../../../../../../DetailsView/components/overview-content/overview-help-section';
import { HyperlinkDefinition } from '../../../../../../views/content/content-page';

describe('OverviewHelpSection', () => {
    const deps = Mock.ofType<HelpLinkDeps>().object;

    test('the component is defined', () => {
        expect(<OverviewHelpSection linkDataSource={[]} deps={deps} />).toBeDefined();
    });

    test('help text is shown properly', () => {
        const props: OverviewHelpProps = {
            linkDataSource: [] as HyperlinkDefinition[],
            deps: {} as HelpLinkDeps,
        };
        const wrapper = shallow(<OverviewHelpSection {...props} />);

        const overviewParentSection = wrapper.find('.overview-help-container');
        expect(overviewParentSection.exists()).toBe(true);

        const h2 = wrapper.find('h3');

        expect(h2.exists()).toBe(true);
        expect(h2.hasClass('help-heading')).toBe(true);
        expect(h2.text()).toBe('Help');
    });
});
