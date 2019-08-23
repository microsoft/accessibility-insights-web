// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { Mock } from 'typemoq';

import { UnifiedRuleResult } from '../../../../../../DetailsView/components/cards/failed-instances-section-v2';
import {
    InstanceDetailsGroupV2,
    InstanceDetailsGroupV2Deps,
    InstanceDetailsGroupV2Props,
} from '../../../../../../DetailsView/components/cards/instance-details-group-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('InstanceDetailsGroupV2', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const rule: UnifiedRuleResult = exampleUnifiedRuleResult;
        const depsStub: InstanceDetailsGroupV2Deps = {} as InstanceDetailsGroupV2Deps;

        const props: InstanceDetailsGroupV2Props = {
            deps: depsStub,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            rule,
        };

        const wrapper = shallow(<InstanceDetailsGroupV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
