// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import {
    RulesWithInstances,
    RulesWithInstancesDeps,
} from '../../../../../../../DetailsView/reports/components/report-sections/rules-with-instances';
import { FixInstructionProcessor } from '../../../../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RulesWithInstances', () => {
    let fixInstructionProcessorMock: IMock<FixInstructionProcessor>;

    beforeEach(() => {
        fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
    });

    it('renders', () => {
        const rules = [
            {
                id: 'test-rule',
                nodes: [
                    {
                        html: '<html>',
                        snippet: '<html>',
                        failureSummary: 'fix the error on html tag',
                    } as AxeNodeResult,
                ],
            } as RuleResult,
        ];

        const depsStub = {} as RulesWithInstancesDeps;

        const wrapped = shallow(
            <RulesWithInstances
                deps={depsStub}
                fixInstructionProcessor={fixInstructionProcessorMock.object}
                outcomeType={'pass'}
                rules={rules}
            />,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
