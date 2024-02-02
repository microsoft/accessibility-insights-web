// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import * as React from 'react';
import {
    NotApplicableChecksSection,
    NotApplicableChecksSectionProps,
} from 'reports/components/report-sections/not-applicable-checks-section';
import { SectionDeps } from 'reports/components/report-sections/report-section-factory';
import { ResultSectionTitle } from '../../../../../../common/components/cards/result-section-title';
import { CollapsibleResultSection } from '../../../../../../reports/components/report-sections/collapsible-result-section';
import { RulesOnly } from '../../../../../../reports/components/report-sections/rules-only';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/report-sections/collapsible-result-section');
jest.mock('../../../../../../common/components/cards/result-section-title');
jest.mock('../../../../../../reports/components/report-sections/rules-only');
describe('NotApplicableChecksSection', () => {
    mockReactComponents([CollapsibleResultSection, ResultSectionTitle, RulesOnly]);
    it('renders', () => {
        const props: NotApplicableChecksSectionProps = {
            deps: {} as SectionDeps,
            cardsViewData: {
                cards: {
                    inapplicable: [
                        {} as CardRuleResult,
                        {} as CardRuleResult,
                        {} as CardRuleResult,
                    ],
                    fail: [],
                    pass: [],
                    unknown: [],
                },
            } as CardsViewModel,
            sectionHeadingLevel: 3,
        };

        const renderResult = render(<NotApplicableChecksSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
