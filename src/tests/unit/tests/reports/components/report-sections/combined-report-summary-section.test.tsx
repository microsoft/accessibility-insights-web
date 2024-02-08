// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { CardResult, CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import { CombinedReportSectionProps } from 'reports/components/report-sections/combined-report-section-factory';
import { CombinedReportSummarySection } from 'reports/components/report-sections/combined-report-summary-section';
import { UrlsSummarySection } from 'reports/components/report-sections/urls-summary-section';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('reports/components/report-sections/urls-summary-section');

describe(CombinedReportSummarySection.displayName, () => {
    mockReactComponents([UrlsSummarySection]);
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
                                urlInfos: [
                                    { url: 'http://url-fail/1', baselineStatus: 'unknown' },
                                    { url: 'http://url-fail/2', baselineStatus: 'unknown' },
                                    { url: 'http://url-fail/3', baselineStatus: 'unknown' },
                                ],
                            },
                        },
                    } as unknown as CardResult,
                    {
                        identifiers: {
                            urls: {
                                urlInfos: [{ url: 'http://url-fail/1', baselineStatus: 'unknown' }],
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
        const wrapper = render(<CombinedReportSummarySection {...props} />);

        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
