// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { DisplayableVisualizationTypeData } from 'common/types/displayable-visualization-type-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AdhocTabStopsTestView,
    AdhocTabStopsTestViewDeps,
    AdhocTabStopsTestViewProps,
} from 'DetailsView/components/adhoc-tab-stops-test-view';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { ContentReference } from 'views/content/content-page';

describe('AdhocTabStopsTestView', () => {
    let props: AdhocTabStopsTestViewProps;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let displayableDataStub: DisplayableVisualizationTypeData;
    let scanDataStub: ScanData;
    let clickHandlerStub: (event: any) => void;
    let visualizationStoreDataStub: VisualizationStoreData;
    let selectedTest: VisualizationType;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let userConfigurationStoreDataStub: UserConfigurationStoreData;
    let visualizationScanResultData: VisualizationScanResultData;
    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        clickHandlerFactoryMock = Mock.ofType(
            DetailsViewToggleClickHandlerFactory,
            MockBehavior.Strict,
        );
        displayableDataStub = {
            title: 'test title',
            toggleLabel: 'test toggle label',
        } as DisplayableVisualizationTypeData;
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
        } as VisualizationStoreData;
        clickHandlerStub = () => {};
        selectedTest = -1;
        featureFlagStoreDataStub = {};
        userConfigurationStoreDataStub = 'stub-user-configuration-store-data' as any;
        visualizationScanResultData = { tabStops: {} } as VisualizationScanResultData;
        props = {
            deps: Mock.ofType<AdhocTabStopsTestViewDeps>().object,
            configuration: {
                getStoreData: getStoreDataMock.object,
                displayableData: displayableDataStub,
            } as VisualizationConfiguration,
            clickHandlerFactory: clickHandlerFactoryMock.object,
            visualizationStoreData: visualizationStoreDataStub,
            selectedTest,
            featureFlagStoreData: featureFlagStoreDataStub,
            visualizationScanResultData,
            tabStoreData: null,
            tabStopsViewStoreData: {
                failureInstanceState: {
                    actionType: CapturedInstanceActionType.CREATE,
                },
            } as TabStopsViewStoreData,
            userConfigurationStoreData: userConfigurationStoreDataStub,
        };

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();
    });

    describe('render', () => {
        const stubGuidance = 'stub-guidance' as ContentReference;

        const scenarios = [
            ['guidance', stubGuidance],
            ['no guidance', null],
        ];

        it('should return target page changed view as tab is changed', () => {
            props.tabStoreData = {
                isChanged: true,
            };

            const wrapper = shallow(<AdhocTabStopsTestView {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it.each(scenarios)('handles %s', (_, guidance) => {
            props.deps = 'stub-deps' as unknown as AdhocTabStopsTestViewDeps;

            props.tabStoreData = {
                isChanged: false,
            };

            if (guidance) {
                props.guidance = guidance;
            }

            const wrapper = shallow(<AdhocTabStopsTestView {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
            verifyAll();
        });
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
