// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { CollapsibleScriptProvider } from '../../../../../../../DetailsView/reports/components/report-sections/collapsible-script-provider';
import {
    FailedInstancesSection,
    FailedInstancesSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/failed-instances-section';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('FailedInstancesSection', () => {
    it('renders', () => {
        const collapsibleScriptProviderMock = Mock.ofType<CollapsibleScriptProvider>();
        collapsibleScriptProviderMock.setup(provider => provider.getDefault()).returns(() => 'test script');

        const props: FailedInstancesSectionProps = {
            collapsibleScriptProvider: collapsibleScriptProviderMock.object,
            scanResult: {
                violations: [{ nodes: [{}, {}] } as RuleResult, { nodes: [{}] } as RuleResult, { nodes: [{}, {}, {}] } as RuleResult],
                passes: [],
                inapplicable: [],
                incomplete: [],
                timestamp: 'today',
                targetPageTitle: 'page title',
                targetPageUrl: 'url://page.url',
            },
        };

        const wrapper = shallow(<FailedInstancesSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
