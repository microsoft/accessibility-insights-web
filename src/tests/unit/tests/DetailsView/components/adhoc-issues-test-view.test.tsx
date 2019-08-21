// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { VisualizationConfiguration } from '../../../../../common/configs/visualization-configuration';
import { DisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
import { ScanData, TestsEnabledState, VisualizationStoreData } from '../../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { AdhocIssuesTestView, AdhocIssuesTestViewProps } from '../../../../../DetailsView/components/adhoc-issues-test-view';
import { DetailsViewToggleClickHandlerFactory } from '../../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';

describe('AdhocIssuesTestView', () => {
    const visualizationStoreDataStub = {
        tests: {},
        scanning: 'test-scanning',
    } as VisualizationStoreData;

    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);

    const displayableDataStub = {
        title: 'test title',
    } as DisplayableVisualizationTypeData;

    const configuration = {
        getStoreData: getStoreDataMock.object,
        displayableData: displayableDataStub,
    } as VisualizationConfiguration;

    const clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory, MockBehavior.Strict);

    const selectedTest: VisualizationType = -1;

    const props = {
        configuration: configuration,
        clickHandlerFactory: clickHandlerFactoryMock.object,
        visualizationStoreData: visualizationStoreDataStub,
        selectedTest: selectedTest,
    } as AdhocIssuesTestViewProps;

    const scanDataStub: ScanData = {
        enabled: true,
    };

    const clickHandlerStub = () => {};

    beforeEach(() => {
        getStoreDataMock.reset();
        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock.reset();
        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();
    });

    it('should return target page changed view as tab is changed', () => {
        props.tabStoreData = {
            isChanged: true,
        } as TabStoreData;

        const actual = shallow(<AdhocIssuesTestView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    it('should return flagged component for cards and issues views', () => {
        props.tabStoreData = {
            isChanged: false,
        } as TabStoreData;

        const actual = shallow(<AdhocIssuesTestView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        // verifyAll();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
