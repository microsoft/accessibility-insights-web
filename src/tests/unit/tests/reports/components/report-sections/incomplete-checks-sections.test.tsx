// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    IncompleteChecksSection,
    IncompleteChecksSectionProps,
} from 'reports/components/report-sections/incomplete-checks-section';
import { SectionDeps } from 'reports/components/report-sections/report-section-factory';

describe('IncompleteChecksSection', () => {
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
        };

        const wrapper = shallow(<IncompleteChecksSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
