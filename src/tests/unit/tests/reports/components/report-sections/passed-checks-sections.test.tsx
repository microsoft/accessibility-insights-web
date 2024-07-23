// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import {
    PassedChecksSection,
    PassedChecksSectionProps,
} from 'reports/components/report-sections/passed-checks-section';

import { CollapsibleResultSection } from '../../../../../../reports/components/report-sections/collapsible-result-section';
import { SectionDeps } from '../../../../../../reports/components/report-sections/report-section-factory';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/collapsible-result-section');
describe('PassedChecksSection', () => {
    mockReactComponents([CollapsibleResultSection]);
    it('renders', () => {
        const props: PassedChecksSectionProps = {
            deps: {} as SectionDeps,
            cardsViewData: {
                cards: {
                    pass: [{} as CardRuleResult, {} as CardRuleResult, {} as CardRuleResult],
                    fail: [],
                    inapplicable: [],
                    unknown: [],
                },
            } as CardsViewModel,
            sectionHeadingLevel: 3,
        };

        const renderResult = render(<PassedChecksSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('renders when card data is missing', () => {
        const props: PassedChecksSectionProps = {
            deps: {} as SectionDeps,
            cardsViewData: {
                cards: {
                    /* missing */
                },
            } as CardsViewModel,
            sectionHeadingLevel: 3,
        };

        const renderResult = render(<PassedChecksSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
