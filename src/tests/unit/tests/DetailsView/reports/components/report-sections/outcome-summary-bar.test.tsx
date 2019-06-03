// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { OutcomeSummaryBar } from '../../../../../../../DetailsView/reports/components/report-sections/outcome-summary-bar';
import { ScanResults } from '../../../../../../../scanner/iruleresults';

describe('OutcomeSummaryBar', () => {
    const noViolations = [];
    const noPasses = [];
    const noNonApplicable = [];

    const violations = [
        {
            nodes: [{}],
        },
        {
            nodes: [{}, {}],
        },
    ];
    const passes = [{}, {}];
    const nonApplicable = [{}, {}, {}];

    const scenarios: [string, ScanResults][] = [
        [
            'failure only',
            {
                violations,
                passes: noPasses,
                inapplicable: noNonApplicable,
            } as ScanResults,
        ],
        [
            'not applicable only',
            {
                violations: noViolations,
                passes,
                inapplicable: noNonApplicable,
            } as ScanResults,
        ],
        [
            'passes only',
            {
                violations: noViolations,
                passes,
                inapplicable: noNonApplicable,
            } as ScanResults,
        ],
        [
            'failures + not applicable only',
            {
                violations: violations,
                passes: noPasses,
                inapplicable: nonApplicable,
            } as ScanResults,
        ],
        [
            'failures + passes only',
            {
                violations: violations,
                passes: passes,
                inapplicable: noNonApplicable,
            } as ScanResults,
        ],
        [
            'not applicable + passes only',
            {
                violations: noViolations,
                passes: passes,
                inapplicable: nonApplicable,
            } as ScanResults,
        ],
        [
            'failures + not applicable + passes',
            {
                violations: violations,
                passes: passes,
                inapplicable: nonApplicable,
            } as ScanResults,
        ],
    ];

    it.each(scenarios)('%s', (_, scanResult) => {
        const props = { scanResult };
        const wrapper = shallow(<OutcomeSummaryBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
