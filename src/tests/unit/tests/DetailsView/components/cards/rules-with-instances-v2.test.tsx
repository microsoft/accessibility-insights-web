// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { RulesWithInstancesV2, RulesWithInstancesV2Deps } from '../../../../../../DetailsView/components/cards/rules-with-instances-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RulesWithInstancesV2', () => {
    let fixInstructionProcessorMock: IMock<FixInstructionProcessor>;

    beforeEach(() => {
        fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
    });

    it('renders', () => {
        const rules = [exampleUnifiedRuleResult];
        const depsStub = {} as RulesWithInstancesV2Deps;

        const wrapped = shallow(
            <RulesWithInstancesV2
                deps={depsStub}
                fixInstructionProcessor={fixInstructionProcessorMock.object}
                outcomeType={'pass'}
                rules={rules}
            />,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
