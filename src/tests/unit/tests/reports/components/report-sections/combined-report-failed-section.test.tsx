// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    CombinedReportFailedSectionProps,
    CombinedReportFailedSection,
    CombinedReportFailedSectionDeps,
} from 'reports/components/report-sections/combined-report-failed-section';
import { exampleUnifiedStatusResults } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { It, Mock, MockBehavior } from 'typemoq';

describe('CombinedReportFailedSection', () => {
    it('renders', () => {
        const collapsibleControlMock = Mock.ofType<
            (props: CollapsibleComponentCardsProps) => JSX.Element
        >(undefined, MockBehavior.Strict);
        const scanMetaDataStub = {} as ScanMetadata;
        const containerId = 'container-id';
        const props: CombinedReportFailedSectionProps = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            } as CombinedReportFailedSectionDeps,
            containerId,
            content: <div>Content</div>,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            scanMetadata: scanMetaDataStub,
        } as CombinedReportFailedSectionProps;

        const expectedCollapsibleControlProps: Partial<CollapsibleComponentCardsProps> = {
            headingLevel: 3,
            deps: {},
        };

        collapsibleControlMock
            .setup(cc => cc(It.isObjectWith(expectedCollapsibleControlProps)))
            .returns(({ header, content }) => (
                <>
                    <div id="collapsible-header">{header}</div>
                    <div id="collapsible-content">{content}</div>
                </>
            ));

        const wrapper = shallow(<CombinedReportFailedSection {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();
    });
});
