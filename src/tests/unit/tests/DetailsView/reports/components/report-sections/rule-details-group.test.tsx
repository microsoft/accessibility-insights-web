// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    RuleDetailsGroup,
    RuleDetailsGroupDeps,
} from '../../../../../../../DetailsView/reports/components/report-sections/rule-details-group';
import { FixInstructionProcessor } from '../../../../../../../injected/fix-instruction-processor';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('RuleDetailsGroup', () => {
    let fixInstructionProcessorMock: IMock<FixInstructionProcessor>;
    const depsStub = {} as RuleDetailsGroupDeps;

    beforeEach(() => {
        fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
    });

    it('renders', () => {
        const rules = [
            {
                id: '1',
                nodes: [
                    {
                        html: '<html>',
                        snippet: '<html>',
                        failureSummary: 'fix the error on html tag',
                    } as AxeNodeResult,
                ],
            } as RuleResult,
        ];

        const wrapped = shallow(
            <RuleDetailsGroup
                deps={depsStub}
                fixInstructionProcessor={fixInstructionProcessorMock.object}
                outcomeType={'pass'}
                rules={rules}
            />,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
