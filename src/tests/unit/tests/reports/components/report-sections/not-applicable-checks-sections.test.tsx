// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardRuleResult, CardsViewModel } from 'common/types/store-data/card-view-model';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    NotApplicableChecksSection,
    NotApplicableChecksSectionProps,
} from 'reports/components/report-sections/not-applicable-checks-section';
import { SectionDeps } from 'reports/components/report-sections/report-section-factory';

describe('NotApplicableChecksSection', () => {
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
            titleHeadingLevel: 3,
        };

        const wrapper = shallow(<NotApplicableChecksSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
