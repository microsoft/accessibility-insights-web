// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { Mock } from 'typemoq';

import { UnifiedRuleResult } from '../../../../../../DetailsView/components/cards/failed-instances-section-v2';
import {
    InstanceDetailsGroup,
    InstanceDetailsGroupDeps,
    InstanceDetailsGroupProps,
} from '../../../../../../DetailsView/components/cards/instance-details-group-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('InstanceDetailsGroup', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const rule: UnifiedRuleResult = exampleUnifiedRuleResult;
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
