// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';

import { IPivotConfiguration, PivotConfiguration } from '../../../../common/configs/pivot-configuration';
import { IDetailsViewContainerState } from '../../../../DetailsView/details-view-container';
import { SelectedDetailsViewProvider } from '../../../../DetailsView/handlers/selected-details-view-provider';
import { DetailsViewPivotType } from './../../../../common/types/details-view-pivot-type';
import { VisualizationType } from './../../../../common/types/visualization-type';
import { VisualizationStoreDataBuilder } from './../../../Common/visualization-store-data-builder';

describe('SelectedDetailsViewHelperTest', () => {
    let pivotConfigMock: IMock<PivotConfiguration>;
    let testSubject: SelectedDetailsViewProvider;

    beforeEach(() => {
        pivotConfigMock = Mock.ofType(PivotConfiguration);
        testSubject = new SelectedDetailsViewProvider(pivotConfigMock.object);
    });

    test('getSelectedDetailsView: store is null', () => {
        expect(testSubject.getSelectedDetailsView(null)).toBeNull();
    });

    test('getSelectedDetailsView', () => {
        const viewType = VisualizationType.Headings;
        const getSelectedDetailsViewStub = (data: IDetailsViewContainerState) => data.visualizationStoreData.selectedFastPassDetailsView;
        const config = { getSelectedDetailsView: getSelectedDetailsViewStub };

        const visualizationStoreData = new VisualizationStoreDataBuilder()
            .with('selectedDetailsViewPivot', DetailsViewPivotType.fastPass)
            .with('selectedFastPassDetailsView', viewType)
            .build();

        const assessmentStoreData = {
            assessmentNavState: {
                selectedTestType: VisualizationType.HeadingsAssessment,
            },
        };

        const detailsViewContainerState = {
            visualizationStoreData: visualizationStoreData,
            assessmentStoreData: assessmentStoreData,
        };

        pivotConfigMock
            .setup(p => p.getConfigByType(visualizationStoreData.selectedDetailsViewPivot))
            .returns(() => config as IPivotConfiguration)
            .verifiable(Times.once());

        expect(testSubject.getSelectedDetailsView(detailsViewContainerState as IDetailsViewContainerState)).toEqual(viewType);
        pivotConfigMock.verifyAll();
    });
});
