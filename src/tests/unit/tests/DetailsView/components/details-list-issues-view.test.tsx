// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { InstancesSectionProps } from 'DetailsView/components/adhoc-issues-test-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { VisualizationConfiguration } from '../../../../../common/configs/visualization-configuration';
import { DisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from '../../../../../common/types/store-data/visualization-store-data';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    DetailsListIssuesView,
    DetailsListIssuesViewDeps,
    DetailsListIssuesViewProps,
} from '../../../../../DetailsView/components/details-list-issues-view';
import { exampleUnifiedStatusResults } from '../../common/components/cards/sample-view-model-data';

describe('DetailsListIssuesView', () => {
    let props: DetailsListIssuesViewProps;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let displayableDataStub: DisplayableVisualizationTypeData;
    let scanDataStub: ScanData;
    let visualizationStoreDataStub: VisualizationStoreData;
    let detailsViewActionMessageCreator: DetailsViewActionMessageCreator;

    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        displayableDataStub = {
            title: 'test title',
            subtitle: <>test subtitle</>,
            toggleLabel: 'test toggle label',
        } as DisplayableVisualizationTypeData;
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
            scanning: 'test-scanning',
        } as VisualizationStoreData;
        detailsViewActionMessageCreator = {} as DetailsViewActionMessageCreator;

        props = {
            deps: {
                detailsViewActionMessageCreator,
            } as DetailsListIssuesViewDeps,
            configuration: {
                getStoreData: getStoreDataMock.object,
                displayableData: displayableDataStub,
            } as VisualizationConfiguration,
            visualizationStoreData: visualizationStoreDataStub,
            cardsViewData: {
                cards: exampleUnifiedStatusResults,
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            },
            instancesSection: NamedFC<InstancesSectionProps>('test', _ => null),
        } as DetailsListIssuesViewProps;

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();
    });

    it('should return issues table with scanning to false', () => {
        props.visualizationStoreData.scanning = null;

        const actual = shallow(<DetailsListIssuesView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
        verifyAll();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
    }
});
