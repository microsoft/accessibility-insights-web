// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    SummarySection,
    SummarySectionProps,
} from 'reports/components/report-sections/summary-section';

describe('SummarySection', () => {
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
    const scenarios: [string, CardsViewModel][] = [
        [
            'failure only',
            {
                cards: {
                    fail: violations,
                    pass: noPasses,
                    inapplicable: noNonApplicable,
                },
            } as CardsViewModel,
        ],
        [
            'not applicable only',
            {
                cards: {
                    fail: noViolations,
                    pass: passes,
                    inapplicable: noNonApplicable,
                },
            } as CardsViewModel,
        ],
        [
            'passes only',
            {
                cards: {
                    fail: noViolations,
                    pass: passes,
                    inapplicable: noNonApplicable,
                },
            } as CardsViewModel,
        ],
        [
            'failures + not applicable only',
            {
                cards: {
                    fail: violations,
                    pass: noPasses,
                    inapplicable: nonApplicable,
                },
            } as CardsViewModel,
        ],
        [
            'failures + passes only',
            {
                cards: {
                    fail: violations,
                    pass: passes,
                    inapplicable: noNonApplicable,
                },
            } as CardsViewModel,
        ],
        [
            'not applicable + passes only',
            {
                cards: {
                    fail: noViolations,
                    pass: passes,
                    inapplicable: nonApplicable,
                },
            } as CardsViewModel,
        ],
        [
            'failures + not applicable + passes',
            {
                cards: {
                    fail: violations,
                    pass: passes,
                    inapplicable: nonApplicable,
                },
            } as CardsViewModel,
        ],
    ];

    it.each(scenarios)('%s', (_, cardsViewData) => {
        const props: SummarySectionProps = {
            cardsViewData: cardsViewData,
        };
        const wrapper = shallow(<SummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
