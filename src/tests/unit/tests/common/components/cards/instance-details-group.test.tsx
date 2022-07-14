// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceDetailsGroup,
    InstanceDetailsGroupDeps,
    InstanceDetailsGroupProps,
} from 'common/components/cards/instance-details-group';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { CardRuleResult } from 'common/types/store-data/card-view-model';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('InstanceDetailsGroup', () => {
    it('renders', () => {
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);
        const recommendColorStub = {} as RecommendColor;
        const rule: CardRuleResult = exampleUnifiedRuleResult;
        const depsStub: InstanceDetailsGroupDeps = {} as InstanceDetailsGroupDeps;

        const props: InstanceDetailsGroupProps = {
            deps: depsStub,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            recommendColor: recommendColorStub,
            rule: rule,
            userConfigurationStoreData: null,
            targetAppInfo: { name: 'app' },
            cardSelectionMessageCreator: {} as CardSelectionMessageCreator,
            narrowModeStatus: {} as NarrowModeStatus,
        };

        const wrapper = shallow(<InstanceDetailsGroup {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
