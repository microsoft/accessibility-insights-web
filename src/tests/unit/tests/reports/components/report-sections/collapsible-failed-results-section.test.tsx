// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    CombinedReportFailedResultsSectionProps,
    CombinedReportFailedResultsSection,
    CombinedReportFailedResultsSectionDeps,
} from 'reports/components/report-sections/combined-report-failed-results-section';
import { exampleUnifiedStatusResults } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { It, Mock } from 'typemoq';

describe('CombinedReportFailedResultsSection', () => {
    it('renders', () => {
        const collapsibleControlMock = Mock.ofType<
            (props: CollapsibleComponentCardsProps) => JSX.Element
        >();
        const scanMetaDataStub = {} as ScanMetadata;
        const containerId = 'container-id';
        const props: CombinedReportFailedResultsSectionProps = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            } as CombinedReportFailedResultsSectionDeps,
            containerId,
            content: <div>Content</div>,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            scanMetadata: scanMetaDataStub,
        } as CombinedReportFailedResultsSectionProps;

        const expectedCollapsibleControlProps: Partial<CollapsibleComponentCardsProps> = {
            headingLevel: 2,
            deps: null,
        };

        collapsibleControlMock
            .setup(cc => cc(It.isObjectWith(expectedCollapsibleControlProps)))
            .returns(() => <div>Collapsible component</div>);

        const wrapper = shallow(<CombinedReportFailedResultsSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
