// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    CollapsibleResultSection,
    CollapsibleResultSectionProps,
} from 'reports/components/report-sections/collapsible-result-section';

describe('CollapsibleResultSection', () => {
    it('renders', () => {
        const props: CollapsibleResultSectionProps = {
            containerClassName: 'result-section-class-name',
            containerId: 'container-id',
        } as CollapsibleResultSectionProps;

        const wrapper = shallow(<CollapsibleResultSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
