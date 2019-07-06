// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    InstanceDetailsGroup,
    InstanceDetailsGroupDeps,
    InstanceDetailsGroupProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/instance-details-group';
import { FixInstructionProcessor } from '../../../../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('InstanceDetailsGroup', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const nodes: AxeNodeResult[] = [
            {
                target: ['<html>'],
                html: '<html>',
                failureSummary: 'fix the error on html',
            } as AxeNodeResult,
            {
                target: ['<body>'],
                html: '<body >',
                failureSummary: 'fix the error on body',
            } as AxeNodeResult,
        ];

        const rule: RuleResult = {
            nodes: nodes,
        } as RuleResult;

        const depsStub: InstanceDetailsGroupDeps = {} as InstanceDetailsGroupDeps;

        const props: InstanceDetailsGroupProps = {
            deps: depsStub,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            rule,
        };

        const wrapper = shallow(<InstanceDetailsGroup {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
