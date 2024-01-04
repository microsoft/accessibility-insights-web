// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    CombinedReportResultSectionTitle,
    CombinedReportResultSectionTitleProps,
} from 'common/components/cards/combined-report-result-section-title';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';

describe.each(allInstanceOutcomeTypes)(
    'ResultSectionTitle with outcomeType %s renders',
    outcomeType => {
        it.each`
            outcomeCount | shouldAlertFailuresCount | description
            ${10}        | ${false}                 | ${'with no-alerting'}
            ${15}        | ${undefined}             | ${'with no-alerting, shouldAlertFailuresCount is undefined'}
            ${0}         | ${true}                  | ${'with alerting, badgeCount is 0'}
            ${1}         | ${true}                  | ${'with alerting, badgeCount is 1'}
            ${2}         | ${true}                  | ${'with alerting, badgeCount is greater than 1'}
        `('$description', ({ outcomeCount, shouldAlertFailuresCount }) => {
            const props: CombinedReportResultSectionTitleProps = {
                title: 'test title',
                outcomeCount,
                outcomeType: outcomeType,
                shouldAlertFailuresCount,
            };

            const renderResult = render(<CombinedReportResultSectionTitle {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    },
);
