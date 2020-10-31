// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    CombinedReportNotApplicableSection,
    CombinedReportPassedSection,
    CombinedReportRulesOnlySectionProps,
} from 'reports/components/report-sections/combined-report-rules-only-sections';
import { exampleUnifiedStatusResults } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { It, Mock, MockBehavior } from 'typemoq';

describe('CombinedReportRulesOnlySections', () => {
    let props: CombinedReportRulesOnlySectionProps;
    beforeEach(() => {
        const collapsibleControlMock = Mock.ofType<
            (props: CollapsibleComponentCardsProps) => JSX.Element
        >(undefined, MockBehavior.Strict);
        props = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            },
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
            },
        } as CombinedReportRulesOnlySectionProps;

        const expectedCollapsibleControlProps: Partial<CollapsibleComponentCardsProps> = {
            headingLevel: 3,
            deps: null,
        };

        collapsibleControlMock
            .setup(cc => cc(It.isObjectWith(expectedCollapsibleControlProps)))
            .returns(({ header, content }) => (
                <>
                    <div id="collapsible-header">{header}</div>
                    <div id="collapsible-content">{content}</div>
                </>
            ));
    });

    describe('CombinedReportPassedSection', () => {
        it('renders', () => {
            const wrapper = shallow(<CombinedReportPassedSection {...props} />);
            expect(wrapper.debug()).toMatchSnapshot();
        });
    });

    describe('CombinedReportNotApplicableSection', () => {
        it('renders', () => {
            const wrapper = shallow(<CombinedReportNotApplicableSection {...props} />);
            expect(wrapper.debug()).toMatchSnapshot();
        });
    });
});
