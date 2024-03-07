// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import {
    IncompleteChecksSection,
    IncompleteChecksSectionProps,
} from 'reports/components/report-sections/incomplete-checks-section';
import { SectionDeps } from 'reports/components/report-sections/report-section-factory';
import { CollapsibleResultSection } from '../../../../../../reports/components/report-sections/collapsible-result-section';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/collapsible-result-section');

describe('IncompleteChecksSection', () => {
    mockReactComponents([CollapsibleResultSection]);
    it('renders', () => {
        const props: IncompleteChecksSectionProps = {
            deps: {} as SectionDeps,
            cardsViewData: {
                cards: {
                    pass: [],
                    fail: [],
                    inapplicable: [],
                    unknown: [{} as CardRuleResult, {} as CardRuleResult, {} as CardRuleResult],
                },
            } as CardsViewModel,
            sectionHeadingLevel: 3,
        };

        const renderResult = render(<IncompleteChecksSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders when card data is missing', () => {
        const props: IncompleteChecksSectionProps = {
            deps: {} as SectionDeps,
            cardsViewData: {
                cards: {
                    /* missing */
                },
            } as CardsViewModel,
            sectionHeadingLevel: 3,
        };

        const renderResult = render(<IncompleteChecksSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
