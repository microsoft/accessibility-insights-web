// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    SectionDeps,
    SectionProps,
} from 'reports/components/report-sections/report-section-factory';
import {
    TabStopsChecksSectionWrapper,
    TabStopsChecksSectionWrapperProps,
} from 'reports/components/report-sections/tab-stops-checks-section-wrapper';

describe('TabStopChecksSectionWrapper', () => {
    it('renders', () => {
        const props: TabStopsChecksSectionWrapperProps = {
            deps: {} as SectionDeps,
            tabStops: {
                'keyboard-navigation': {
                    status: 'pass',
                    instances: [],
                    isExpanded: false,
                },
                'keyboard-traps': {
                    status: 'fail',
                    instances: [],
                    isExpanded: false,
                },
                'focus-indicator': {
                    status: 'unknown',
                    instances: [],
                    isExpanded: false,
                },
                'tab-order': {
                    status: 'pass',
                    instances: [],
                    isExpanded: false,
                },
                'input-focus': {
                    status: 'unknown',
                    instances: [],
                    isExpanded: false,
                },
            },
            checksSection: NamedFC<SectionProps>('test', props => <div {...props} />),
        };

        const wrapper = shallow(<TabStopsChecksSectionWrapper {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
