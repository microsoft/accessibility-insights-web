// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ISelection } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { DisplayableVisualizationTypeData } from '../../../../../common/configs/visualization-configuration-factory';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
import { VisualizationScanResultData } from '../../../../../common/types/store-data/visualization-scan-result-data';
import { ScanData, TestsEnabledState, VisualizationStoreData } from '../../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { IssuesTableHandler } from '../../../../../DetailsView/components/issues-table-handler';
import { IssuesView, IssuesViewProps } from '../../../../../DetailsView/components/issues-view';
import { DetailsViewToggleClickHandlerFactory } from '../../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { VisualizationScanResultStoreDataBuilder } from '../../../common/visualization-scan-result-store-data-builder';

describe('IssuesView', () => {
    let props: IssuesViewProps;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let displayableDataStub: DisplayableVisualizationTypeData;
    let contentStub: JSX.Element;
    let scanDataStub: ScanData;
    let clickHandlerStub: (event: any) => void;
    let visualizationStoreDataStub: VisualizationStoreData;
    let visualizationScanResultStoreDataStub: VisualizationScanResultData;
    let selectedTest: VisualizationType;
    let actionMessageCreatorStub: DetailsViewActionMessageCreator;
    let issuesSelectionStub: ISelection;
    let issuesTableHandlerStub: IssuesTableHandler;

    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory, MockBehavior.Strict);
        visualizationScanResultStoreDataStub = new VisualizationScanResultStoreDataBuilder().build();
        contentStub = {} as JSX.Element;
        displayableDataStub = {
            title: 'test title',
            subtitle: <>test subtitle</>,
            toggleLabel: 'test toggle label',
        } as DisplayableVisualizationTypeData;
        contentStub = {} as JSX.Element;
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
            scanning: 'test-scanning',
        } as VisualizationStoreData;
        clickHandlerStub = () => {};
        actionMessageCreatorStub = {} as DetailsViewActionMessageCreator;
        issuesSelectionStub = {} as ISelection;
        issuesTableHandlerStub = {} as IssuesTableHandler;
        selectedTest = -1;

        props = {
            deps: {
                detailsViewActionMessageCreator: actionMessageCreatorStub,
            },
            configuration: {
                getStoreData: getStoreDataMock.object,
                displayableData: displayableDataStub,
                detailsViewStaticContent: contentStub,
            },
            clickHandlerFactory: clickHandlerFactoryMock.object,
            visualizationStoreData: visualizationStoreDataStub,
            selectedTest,
            issuesSelection: issuesSelectionStub,
            issuesTableHandler: issuesTableHandlerStub,
            visualizationScanResultData: visualizationScanResultStoreDataStub,
        } as any;

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();
    });

    it('should return issues table with scanning to false', () => {
        props.tabStoreData = {
            isChanged: false,
        } as TabStoreData;
        props.visualizationStoreData.scanning = null;

        const actual = shallow(<IssuesView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    it('should return issues table with violations to null', () => {
        props.tabStoreData = {
            isChanged: false,
        } as TabStoreData;
        props.visualizationScanResultData.issues.scanResult = null;

        const actual = shallow(<IssuesView {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
        verifyAll();
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
