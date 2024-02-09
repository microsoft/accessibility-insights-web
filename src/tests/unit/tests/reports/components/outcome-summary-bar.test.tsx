// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CheckIcon, CheckIconInverted } from 'common/icons/check-icon';
import { CircleIcon } from 'common/icons/circle-icon';
import { CrossIcon, CrossIconInverted } from 'common/icons/cross-icon';
import { InapplicableIconInverted } from 'common/icons/inapplicable-icon';
import * as React from 'react';
import { OutcomeSummaryBar, OutcomeSummaryBarProps } from 'reports/components/outcome-summary-bar';
import { OutcomeType } from 'reports/components/outcome-type';
import { mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';

jest.mock('common/icons/check-icon');
jest.mock('common/icons/circle-icon');
jest.mock('common/icons/cross-icon');
jest.mock('common/icons/inapplicable-icon');

describe('OutcomeSummaryBar', () => {
    mockReactComponents([
        CrossIcon,
        CheckIcon,
        CheckIconInverted,
        CircleIcon,
        CrossIconInverted,
        InapplicableIconInverted,
    ]);
    const allOutcomeTypes: OutcomeType[] = ['pass', 'fail', 'incomplete'];
    const outcomeStats = {
        pass: 42,
        incomplete: 7,
        fail: 13,
    };

    it('show by percentage', () => {
        const props: OutcomeSummaryBarProps = { outcomeStats, allOutcomeTypes, countSuffix: '%' };
        const renderResult = render(<OutcomeSummaryBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('show by count', () => {
        const props: OutcomeSummaryBarProps = { outcomeStats, allOutcomeTypes };
        const renderResult = render(<OutcomeSummaryBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('render inverted badges', () => {
        const props: OutcomeSummaryBarProps = {
            outcomeStats,
            allOutcomeTypes,
            iconStyleInverted: true,
        };
        const renderResult = render(<OutcomeSummaryBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('show with text label', () => {
        const props: OutcomeSummaryBarProps = { outcomeStats, allOutcomeTypes, textLabel: true };
        const renderResult = render(<OutcomeSummaryBar {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
