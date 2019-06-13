// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import {
    FailedInstancesSection,
    FailedInstancesSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/failed-instances-section';
import { RuleResult } from '../../../../../../../scanner/iruleresults';
import { FixInstructionProcessor } from '../../../../../../../injected/fix-instruction-processor';

describe('FailedInstancesSection', () => {
    it('renders', () => {
        const getScriptMock = Mock.ofInstance(() => '');
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        getScriptMock.setup(getScript => getScript()).returns(() => 'test script');

        const props: FailedInstancesSectionProps = {
            getCollapsibleScript: getScriptMock.object,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
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
