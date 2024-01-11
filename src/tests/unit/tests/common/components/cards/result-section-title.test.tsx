// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { OutcomeChip } from 'reports/components/outcome-chip';
import { HeadingElementForLevel } from 'common/components/heading-element-for-level';
import * as React from 'react';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';

jest.mock('common/components/heading-element-for-level');
jest.mock('reports/components/outcome-chip');

mockReactComponents([OutcomeChip, HeadingElementForLevel]);
describe.each(allInstanceOutcomeTypes)(
    'ResultSectionTitle with outcomeType %s renders',
    outcomeType => {
        it.each`
            badgeCount | shouldAlertFailuresCount | titleSize    | description
            ${10}      | ${false}                 | ${'title'}   | ${'with no-alerting'}
            ${15}      | ${undefined}             | ${'title'}   | ${'with no-alerting, shouldAlertFailuresCount is undefined'}
            ${0}       | ${true}                  | ${'title'}   | ${'with alerting, badgeCount is 0'}
            ${1}       | ${true}                  | ${'title'}   | ${'with alerting, badgeCount is 1'}
            ${2}       | ${true}                  | ${'title'}   | ${'with alerting, badgeCount is greater than 1'}
            ${10}      | ${false}                 | ${'heading'} | ${'with no-alerting, titleSize=heading'}
        `('$description', ({ badgeCount, shouldAlertFailuresCount, titleSize }) => {
            const props: ResultSectionTitleProps = {
                title: 'test title',
                badgeCount,
                shouldAlertFailuresCount,
                outcomeType: outcomeType,
                titleSize,
            };

            const renderResult = render(<ResultSectionTitle {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    },
);
