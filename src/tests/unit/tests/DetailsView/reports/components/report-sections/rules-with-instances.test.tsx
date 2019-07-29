// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import {
    RulesWithInstances,
    RulesWithInstancesDeps,
} from 'reports/components/report-sections/rules-with-instances';
import { RuleResult } from 'scanner/iruleresults';
import { IMock, Mock } from 'typemoq';

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
