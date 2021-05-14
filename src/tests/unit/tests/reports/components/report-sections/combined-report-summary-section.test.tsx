// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardResult, CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import { CombinedReportSummarySection } from 'reports/components/report-sections/combined-report-summary-section';

describe(CombinedReportSummarySection, () => {
    const urlResultCounts = {
        passedUrls: 1,
        failedUrls: 2,
        unscannableUrls: 3,
    };

    const cards = {
        fail: [
            {
                id: 'some-rule',
                nodes: [
                    {
                        identifiers: {
                            urls: {
                                urls: [
                                    'http://url-fail/1',
                                    'http://url-fail/2',
                                    'http://url-fail/3',
                                ],
                            },
                        },
                    } as unknown as CardResult,
                    {
                        identifiers: {
                            urls: {
                                urls: ['http://url-fail/1'],
                            },
                        },
                    } as unknown as CardResult,
                ],
            },
        ],
        pass: [],
        unknown: [],
        inapplicable: [],
    } as CardRuleResultsByStatus;

    it('renders', () => {
        const props = {
            urlResultCounts,
            cardsViewData: {
                cards,
            },
        } as unknown as CombinedReportSectionProps;
        const wrapper = shallow(<CombinedReportSummarySection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
