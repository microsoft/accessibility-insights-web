// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { SectionDeps } from 'reports/components/report-sections/report-section-factory';
import {
    TabStopsChecksSectionWrapper,
    TabStopsChecksSectionWrapperProps,
} from 'reports/components/report-sections/tab-stops-checks-section-wrapper';
import { PassedChecksSection } from '../../../../../../reports/components/report-sections/passed-checks-section';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../../reports/components/report-sections/passed-checks-section');
describe('TabStopChecksSectionWrapper', () => {
    mockReactComponents([PassedChecksSection]);
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
            checksSection: PassedChecksSection,
            sectionHeadingLevel: 3,
            featureFlagStoreData: {},
        };

        const renderResult = render(<TabStopsChecksSectionWrapper {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([PassedChecksSection]);
    });
});
