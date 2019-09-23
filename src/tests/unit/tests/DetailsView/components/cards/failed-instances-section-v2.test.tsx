// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    FailedInstancesSectionV2,
    FailedInstancesSectionV2Deps,
    FailedInstancesSectionV2Props,
} from '../../../../../../DetailsView/components/cards/failed-instances-section-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('FailedInstancesSectionV2', () => {
    it('renders', () => {
        const props: FailedInstancesSectionV2Props = {
            deps: {} as FailedInstancesSectionV2Deps,
            ruleResultsByStatus: {
                pass: [],
                fail: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
                inapplicable: [],
                unknown: [],
            },
        };

        const wrapper = shallow(<FailedInstancesSectionV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders null when result is null', () => {
        const props: FailedInstancesSectionV2Props = {
            deps: {} as FailedInstancesSectionV2Deps,
            ruleResultsByStatus: null,
        };

        const wrapper = shallow(<FailedInstancesSectionV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
