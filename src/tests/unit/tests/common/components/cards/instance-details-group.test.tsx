// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceDetailsGroup, InstanceDetailsGroupDeps, InstanceDetailsGroupProps } from 'common/components/cards/instance-details-group';
import { UnifiedRuleResult } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { Mock } from 'typemoq';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('InstanceDetailsGroup', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const rule: UnifiedRuleResult = exampleUnifiedRuleResult;
        const depsStub: InstanceDetailsGroupDeps = {} as InstanceDetailsGroupDeps;

        const props: InstanceDetailsGroupProps = {
            deps: depsStub,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            rule: rule,
            userConfigurationStoreData: null,
            targetAppInfo: { name: 'app' },
        };

        const wrapper = shallow(<InstanceDetailsGroup {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
