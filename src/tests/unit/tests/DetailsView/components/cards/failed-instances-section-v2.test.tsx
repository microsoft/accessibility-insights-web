// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GetGuidanceTagsFromGuidanceLinks } from 'common/get-guidance-tags-from-guidance-links';
import { shallow } from 'enzyme';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';
import { Mock } from 'typemoq';

import { UnifiedResult } from '../../../../../../common/types/store-data/unified-data-interface';
import {
    FailedInstancesSectionV2,
    FailedInstancesSectionV2Props,
    UnifiedRuleResult,
} from '../../../../../../DetailsView/components/cards/failed-instances-section-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('FailedInstancesSectionV2', () => {
    it('renders', () => {
        const getGuidanceTagsStub: GetGuidanceTagsFromGuidanceLinks = () => [];
        const fixInstructionProcessorMock = Mock.ofType(FixInstructionProcessor);

        const props: FailedInstancesSectionV2Props = {
            getGuidanceTagsFromGuidanceLinks: getGuidanceTagsStub,
            fixInstructionProcessor: fixInstructionProcessorMock.object,
            result: {
                pass: [],
                fail: [exampleUnifiedRuleResult],
                inapplicable: [],
                unknown: [],
            },
        };

        const wrapper = shallow(<FailedInstancesSectionV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
