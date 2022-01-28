// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    PassedChecksSection,
    PassedChecksSectionProps,
} from 'reports/components/report-sections/passed-checks-section';

import { SectionDeps } from '../../../../../../reports/components/report-sections/report-section-factory';

describe('PassedChecksSection', () => {
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
            titleHeadingLevel: 3,
        };

        const wrapper = shallow(<PassedChecksSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders when card data is missing', () => {
        const props: PassedChecksSectionProps = {
            deps: {} as SectionDeps,
            cardsViewData: {
                cards: {
                    /* missing */
                },
            } as CardsViewModel,
            titleHeadingLevel: 3,
        };

        const wrapper = shallow(<PassedChecksSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
