// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { IDisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import { IScanData, ITestsEnabledState, IVisualizationStoreData } from '../../../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { AdhocStaticTestView, IAdhocStaticTestViewProps } from '../../../../../DetailsView/components/adhoc-static-test-view';
import { DetailsViewToggleClickHandlerFactory } from '../../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';

describe('AdhocStaticTestView', () => {
    let props: IAdhocStaticTestViewProps;
    let getStoreDataMock: IMock<(data: ITestsEnabledState) => IScanData>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let displayableDataStub: IDisplayableVisualizationTypeData;
    let contentStub: JSX.Element;
    let scanDataStub: IScanData;
    let clickHandlerStub: (event: any) => void;
    let visualizationStoreDataStub: IVisualizationStoreData;
    let selectedTest: VisualizationType;

    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory, MockBehavior.Strict);
        contentStub = {} as JSX.Element;
        displayableDataStub = {
            title: 'test title',
            toggleLabel: 'test toggle label',
        } as IDisplayableVisualizationTypeData;
        contentStub = {} as JSX.Element;
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
        } as IVisualizationStoreData;
        clickHandlerStub = () => {};
        selectedTest = -1;

        props = {
            configuration: {
                getStoreData: getStoreDataMock.object,
                displayableData: displayableDataStub,
                detailsViewStaticContent: contentStub,
            },
            clickHandlerFactory: clickHandlerFactoryMock.object,
            visualizationStoreData: visualizationStoreDataStub,
            selectedTest,
        } as IAdhocStaticTestViewProps;

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();
    });

    it('should return target page changed view as tab is changed', () => {
        props.tabStoreData = {
            isChanged: true,
        };

        const actual = shallow(<AdhocStaticTestView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    it('should return static content details view', () => {
        props.tabStoreData = {
            isChanged: false,
        };

        const actual = shallow(<AdhocStaticTestView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
