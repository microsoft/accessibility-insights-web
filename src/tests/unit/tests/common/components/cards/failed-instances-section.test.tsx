// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    FailedInstancesSection,
    FailedInstancesSectionDeps,
    FailedInstancesSectionProps,
} from '../../../../../../DetailsView/components/cards/failed-instances-section';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('FailedInstancesSection', () => {
    it('renders', () => {
        const props: FailedInstancesSectionProps = {
            deps: {} as FailedInstancesSectionDeps,
            ruleResultsByStatus: {
                pass: [],
                fail: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
                inapplicable: [],
                unknown: [],
            },
        };

        const wrapper = shallow(<FailedInstancesSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders null when result is null', () => {
        const props: FailedInstancesSectionProps = {
            deps: {} as FailedInstancesSectionDeps,
            ruleResultsByStatus: null,
        };

        const wrapper = shallow(<FailedInstancesSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
