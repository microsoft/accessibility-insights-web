// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CollapsibleComponentCardsProps } from 'common/components/cards/collapsible-component-cards';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    CollapsibleFailedResultsSectionProps,
    CollapsibleFailedResultsSection,
    CollapsibleFailedResultsSectionDeps,
} from 'reports/components/report-sections/collapsible-failed-results-section';
import { exampleUnifiedStatusResults } from 'tests/unit/tests/common/components/cards/sample-view-model-data';
import { It, Mock } from 'typemoq';

describe('CollapsibleFailedResultsSection', () => {
    it('renders', () => {
        const collapsibleControlMock = Mock.ofType<
            (props: CollapsibleComponentCardsProps) => JSX.Element
        >();
        const scanMetaDataStub = {} as ScanMetadata;
        const containerId = 'container-id';
        const props: CollapsibleFailedResultsSectionProps = {
            deps: {
                collapsibleControl: collapsibleControlMock.object,
            } as CollapsibleFailedResultsSectionDeps,
            containerId,
            content: <div>Content</div>,
            cardsByRule: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            scanMetadata: scanMetaDataStub,
        } as CollapsibleFailedResultsSectionProps;

        const expectedCollapsibleControlProps: Partial<CollapsibleComponentCardsProps> = {
            headingLevel: 2,
            deps: null,
        };

        collapsibleControlMock
            .setup(cc => cc(It.isObjectWith(expectedCollapsibleControlProps)))
            .returns(() => <div>Collapsible component</div>);

        const wrapper = shallow(<CollapsibleFailedResultsSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
