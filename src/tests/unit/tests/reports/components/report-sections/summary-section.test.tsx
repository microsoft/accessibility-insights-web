// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import { InstanceOutcomeType } from 'reports/components/instance-outcome-type';
import {
    AllOutcomesSummarySection,
    BaseSummarySection,
    PassFailSummarySection,
    SummarySectionProps,
} from 'reports/components/report-sections/summary-section';
import { OutcomeSummaryBar } from '../../../../../../reports/components/outcome-summary-bar';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../../reports/components/outcome-summary-bar');

describe('SummarySection', () => {
    mockReactComponents([OutcomeSummaryBar]);
    const noViolations = [];
    const noPasses = [];
    const noNonApplicable = [];
    const outcomeTypes: InstanceOutcomeType[] = ['pass'];
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
                    pass: noPasses,
                    inapplicable: nonApplicable,
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

    it.each(scenarios)('BaseSummarySection: %s', (_, cardsViewData) => {
        const props: SummarySectionProps = {
            cardsViewData: cardsViewData,
        };
        const renderResult = render(
            <BaseSummarySection {...props} outcomeTypesShown={outcomeTypes} />,
        );

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    describe('AllOutcomesSummarySection', () => {
        test('renders BaseSummarySection with all outcome types', () => {
            const props: SummarySectionProps = {
                cardsViewData: {
                    cards: {
                        fail: noViolations,
                        pass: noPasses,
                        inapplicable: nonApplicable,
                    },
                } as CardsViewModel,
            };
            const renderResult = render(<AllOutcomesSummarySection {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });

    describe('PassFailSummarySection: %s', () => {
        test('renders BaseSummarySection with only pass and failed outcome types', () => {
            const props: SummarySectionProps = {
                cardsViewData: {
                    cards: {
                        fail: noViolations,
                        pass: noPasses,
                        inapplicable: nonApplicable,
                    },
                } as CardsViewModel,
            };
            const renderResult = render(<PassFailSummarySection {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
