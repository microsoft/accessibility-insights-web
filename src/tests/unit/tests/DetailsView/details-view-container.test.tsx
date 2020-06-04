// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { StoreActionMessageCreator } from 'common/message-creators/store-action-message-creator';
import { StoreActionMessageCreatorImpl } from 'common/message-creators/store-action-message-creator-impl';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    TargetAppData,
    ToolData,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from 'DetailsView/components/details-view-right-panel';
import { GetSelectedDetailsViewProps } from 'DetailsView/components/left-nav/get-selected-details-view';
import {
    DetailsViewContainer,
    DetailsViewContainerDeps,
    DetailsViewContainerProps,
    DetailsViewContainerState,
} from 'DetailsView/details-view-container';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DetailsViewStoreDataBuilder } from '../../common/details-view-store-data-builder';
import { TabStoreDataBuilder } from '../../common/tab-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import { DetailsViewContainerPropsBuilder } from './details-view-container-props-builder';
import { StoreMocks } from './store-mocks';

describe('DetailsViewContainer', () => {
    const pageTitle = 'DetailsViewContainerTest title';
    const pageUrl = 'http://detailsViewContainerTest/url/';
    let detailsViewActionMessageCreator: IMock<DetailsViewActionMessageCreator>;
    let deps: DetailsViewContainerDeps;
    let targetAppInfo: TargetAppData;
    let isResultHighlightUnavailableStub: IsResultHighlightUnavailable;
    let timestamp: string;
    let toolData: ToolData;

    beforeEach(() => {
        detailsViewActionMessageCreator = Mock.ofType<DetailsViewActionMessageCreator>();
        isResultHighlightUnavailableStub = () => null;
        timestamp = 'timestamp';
        targetAppInfo = {
            name: pageTitle,
            url: pageUrl,
        };
        toolData = {
            applicationProperties: { name: 'some app' },
        } as ToolData;
        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreator.object,
            isResultHighlightUnavailable: isResultHighlightUnavailableStub,
        } as DetailsViewContainerDeps;
    });

    describe('render', () => {
        it('renders spinner when stores not ready', () => {
            const detailsViewStoreActionMessageCreatorMock = Mock.ofType(
                StoreActionMessageCreatorImpl,
                MockBehavior.Strict,
            );
            detailsViewStoreActionMessageCreatorMock
                .setup(amc => amc.getAllStates())
                .verifiable(Times.once());

            const storeMocks = new StoreMocks()
                .setDetailsViewStoreData(null)
                .setVisualizationStoreData(null)
                .setUserConfigurationStoreData({
                    enableTelemetry: true,
                } as UserConfigurationStoreData);

            const props = new DetailsViewContainerPropsBuilder(deps)
                .setStoreMocks(storeMocks)
                .setStoresHubMock(createStoresHubMock(storeMocks, true, false).object)
                .setDetailsViewStoreActionMessageCreator(
                    detailsViewStoreActionMessageCreatorMock.object,
                )
                .build();

            const testObject = shallow(<DetailsViewContainer {...props} />);

            expect(testObject.getElement()).toMatchSnapshot();
        });
    });

    describe('renderContent', () => {
        it('renders normally', () => {
            const viewType = -1;
            testRenderStaticContent(viewType, false);
        });

        it('renders TargetPageClosedView when target page closed', () => {
            const dropdownClickHandler = Mock.ofType(DropdownClickHandler);
            const props = new DetailsViewContainerPropsBuilder(null)
                .setDropdownClickHandler(dropdownClickHandler.object)
                .build();
            const rendered = shallow(<DetailsViewContainer {...props} />);
            expect(rendered.debug()).toMatchSnapshot();
        });

        it('shows target tab was closed when stores are not loaded', () => {
            const storeActionCreator = Mock.ofType(
                StoreActionMessageCreatorImpl,
                MockBehavior.Strict,
            );

            const visualizationStoreData = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', VisualizationType.Issues)
                .build();

            setupActionMessageCreatorMock(
                detailsViewActionMessageCreator,
                visualizationStoreData.selectedDetailsViewPivot,
                1,
            );

            const tabStoreData: TabStoreData = {
                title: pageTitle,
                url: pageUrl,
                id: 1,
                isClosed: true,
                isChanged: false,
                isPageHidden: false,
                isOriginChanged: false,
            };

            const storeMocks = new StoreMocks()
                .setVisualizationStoreData(visualizationStoreData)
                .setTabStoreData(tabStoreData);

            const detailsViewStoreActionCreatorMock = Mock.ofType<StoreActionMessageCreator>();

            const props = new DetailsViewContainerPropsBuilder(deps)
                .setStoreMocks(storeMocks)
                .setStoreActionMessageCreator(storeActionCreator.object)
                .setDetailsViewStoreActionMessageCreator(detailsViewStoreActionCreatorMock.object)
                .setStoresHubMock(createStoresHubMock(storeMocks, false).object)
                .build();

            const rendered = shallow(<DetailsViewContainer {...props} />);
            expect(rendered.debug()).toMatchSnapshot();
        });

        it('shows NoContentAvailable when target page is closed', () => {
            const storesHubMock = Mock.ofType(BaseClientStoresHub);

            const props: DetailsViewContainerProps = {
                storeState: {
                    tabStoreData: {
                        isClosed: true,
                    },
                },
                deps: {
                    storesHub: storesHubMock.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => true);

            const rendered = shallow(<DetailsViewContainer {...props} />);
            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('shows NoContentAvailable when target page is changed and no permissions granted', () => {
            const storesHubMock = Mock.ofType(BaseClientStoresHub);

            const props: DetailsViewContainerProps = {
                storeState: {
                    tabStoreData: {
                        isClosed: false,
                        isOriginChanged: true,
                    },
                    permissionsStateStoreData: {
                        hasAllUrlAndFilePermissions: false,
                    },
                },
                deps: {
                    storesHub: storesHubMock.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => true);

            const rendered = shallow(<DetailsViewContainer {...props} />);
            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('render twice; should not call details view opened on second render', () => {
            const storeActionCreator = Mock.ofType(
                StoreActionMessageCreatorImpl,
                MockBehavior.Strict,
            );
            const getSelectedDetailsViewMock = Mock.ofInstance(
                (theProps: GetSelectedDetailsViewProps) => null,
                MockBehavior.Strict,
            );
            const rightContentPanelType = 'TestView';
            const viewType = VisualizationType.Headings;
            const visualizationStoreData = new VisualizationStoreDataBuilder().build();
            const detailsViewState = new DetailsViewStoreDataBuilder()
                .withDetailsViewRightContentPanel(rightContentPanelType)
                .build();
            const tabStoreData = new TabStoreDataBuilder().with('isClosed', false).build();
            setupActionMessageCreatorMock(
                detailsViewActionMessageCreator,
                visualizationStoreData.selectedDetailsViewPivot,
                1,
            );

            const unifiedScanResultStoreData: UnifiedScanResultStoreData = {
                results: [],
                rules: [],
            };

            const storeMocks = new StoreMocks()
                .setVisualizationStoreData(visualizationStoreData)
                .setTabStoreData(tabStoreData)
                .setDetailsViewStoreData(detailsViewState)
                .setUnifiedScanResultStoreData(unifiedScanResultStoreData);

            const props = new DetailsViewContainerPropsBuilder(deps)
                .setStoreMocks(storeMocks)
                .setStoreActionMessageCreator(storeActionCreator.object)
                .setStoresHubMock(createStoresHubMock(storeMocks).object)
                .build();

            const testObject = new DetailsViewContainer(props);
            const state = getState(storeMocks, -1, null);
            testObject.state = getState(storeMocks, -1, null);

            getSelectedDetailsViewMock
                .setup(gsdvm =>
                    gsdvm(
                        It.isObjectWith({
                            assessmentStoreData: state.assessmentStoreData,
                            visualizationStoreData: state.visualizationStoreData,
                            pathSnippetStoreData: state.pathSnippetStoreData,
                        }),
                    ),
                )
                .returns(() => viewType);
            testObject.render();

            detailsViewActionMessageCreator.verifyAll();
            detailsViewActionMessageCreator.reset();
            setupActionMessageCreatorMock(
                detailsViewActionMessageCreator,
                visualizationStoreData.selectedDetailsViewPivot,
                0,
            );

            testObject.render();
            detailsViewActionMessageCreator.verifyAll();
        });

        it('shows target tab for nonsupported type', () => {
            const unsupportedType = null;

            const toggleClickHandlerMock = Mock.ofInstance(event => {});
            const clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory);
            const storeActionCreator = Mock.ofType(
                StoreActionMessageCreatorImpl,
                MockBehavior.Strict,
            );

            const visualizationStoreData = new VisualizationStoreDataBuilder()
                .with('selectedAdhocDetailsView', unsupportedType)
                .build();

            const storeMocks = new StoreMocks()
                .setDetailsViewStoreData(null)
                .setVisualizationStoreData(visualizationStoreData);

            const props = new DetailsViewContainerPropsBuilder(deps)
                .setStoreMocks(storeMocks)
                .setStoreActionMessageCreator(storeActionCreator.object)
                .setStoresHubMock(createStoresHubMock(storeMocks, false).object)
                .build();

            clickHandlerFactoryMock
                .setup(factory => factory.createClickHandler(It.isAny(), It.isAny()))
                .returns(() => toggleClickHandlerMock.object)
                .verifiable(Times.never());

            const testObject = new DetailsViewContainer(props);
            expect(testObject.render).toThrow();
            clickHandlerFactoryMock.verifyAll();
        });
    });

    function createStoresHubMock(
        storeMocks: StoreMocks,
        hasStores = true,
        hasStoreData = true,
    ): IMock<BaseClientStoresHub<any>> {
        const storesHubMock = Mock.ofType(BaseClientStoresHub);
        storesHubMock.setup(s => s.hasStores()).returns(() => hasStores);
        storesHubMock.setup(s => s.hasStoreData()).returns(() => hasStoreData);
        storesHubMock.setup(s => s.addChangedListenerToAllStores(It.isAny())).verifiable();
        storesHubMock.setup(s => s.removeChangedListenerFromAllStores(It.isAny())).verifiable();

        storesHubMock
            .setup(s => s.getAllStoreData())
            .returns(() => {
                return (
                    storeMocks && {
                        visualizationStoreData: storeMocks.visualizationStoreData,
                        tabStoreData: storeMocks.tabStoreData,
                        visualizationScanResultStoreData:
                            storeMocks.visualizationScanResultsStoreData,
                        featureFlagStoreData: storeMocks.featureFlagStoreData,
                        detailsViewStoreData: storeMocks.detailsViewStoreData,
                        assessmentStoreData: storeMocks.assessmentStoreData,
                        pathSnippetStoreData: storeMocks.pathSnippetStoreData,
                        scopingPanelStateStoreData: storeMocks.scopingStoreData,
                        userConfigurationStoreData: storeMocks.userConfigurationStoreData,
                        unifiedScanResultStoreData: storeMocks.unifiedScanResultStoreData,
                        cardSelectionStoreData: storeMocks.cardSelectionStoreData,
                    }
                );
            });
        return storesHubMock;
    }

    function setupActionMessageCreatorMock(
        mock: IMock<DetailsViewActionMessageCreator>,
        pivot: DetailsViewPivotType,
        timesCalled: number,
    ): void {
        mock.setup(acm => acm.detailsViewOpened(pivot)).verifiable(Times.exactly(timesCalled));
    }

    function getState(
        storeMocks: StoreMocks,
        viewType: VisualizationType,
        rightPanel: DetailsRightPanelConfiguration,
    ): DetailsViewContainerState {
        return {
            visualizationStoreData: storeMocks.visualizationStoreData,
            tabStoreData: storeMocks.tabStoreData,
            featureFlagStoreData: storeMocks.featureFlagStoreData,
            detailsViewStoreData: storeMocks.detailsViewStoreData,
            assessmentStoreData: storeMocks.assessmentStoreData,
            pathSnippetStoreData: storeMocks.pathSnippetStoreData,
            userConfigurationStoreData: storeMocks.userConfigurationStoreData,
            visualizationScanResultStoreData: storeMocks.visualizationScanResultsStoreData,
            scopingPanelStateStoreData: storeMocks.scopingSelectorsData,
            unifiedScanResultStoreData: storeMocks.unifiedScanResultStoreData,
            selectedDetailsView: viewType,
            selectedDetailsRightPanelConfiguration: rightPanel,
            cardSelectionStoreData: storeMocks.cardSelectionStoreData,
            permissionsStateStoreData: storeMocks.permissionsStateStoreData,
        };
    }

    function testRenderStaticContent(
        viewType: VisualizationType,
        isPreviewFeaturesOpen: boolean,
    ): void {
        const dropdownClickHandler = Mock.ofType(DropdownClickHandler);
        const rightContentPanelType = 'TestView';
        const rightContentPanelConfig = {} as DetailsRightPanelConfiguration;
        const visualizationStoreData = new VisualizationStoreDataBuilder()
            .withSelectedDetailsViewPivot(DetailsViewPivotType.fastPass)
            .with('selectedAdhocDetailsView', viewType)
            .build();

        setupActionMessageCreatorMock(
            detailsViewActionMessageCreator,
            visualizationStoreData.selectedDetailsViewPivot,
            1,
        );

        const detailsViewState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(isPreviewFeaturesOpen)
            .withDetailsViewRightContentPanel(rightContentPanelType)
            .build();

        const userConfigurationStoreData: UserConfigurationStoreData = {
            isFirstTime: false,
            enableTelemetry: true,
            enableHighContrast: false,
            lastSelectedHighContrast: false,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: { repository: 'gitHub-repository' } },
        };

        const unifiedScanResultStoreData: UnifiedScanResultStoreData = {
            results: [],
            rules: [],
            targetAppInfo: targetAppInfo,
            timestamp: timestamp,
            toolInfo: toolData,
        };

        const storeMocks = new StoreMocks()
            .setVisualizationStoreData(visualizationStoreData)
            .setDetailsViewStoreData(detailsViewState)
            .setUserConfigurationStoreData(userConfigurationStoreData)
            .setUnifiedScanResultStoreData(unifiedScanResultStoreData);

        const storesHubMock = createStoresHubMock(storeMocks);

        deps.dropdownClickHandler = dropdownClickHandler.object;

        const props = new DetailsViewContainerPropsBuilder(deps)
            .setStoreMocks(storeMocks)
            .setStoresHubMock(storesHubMock.object)
            .build();

        const testObject = new DetailsViewContainer(props);
        const state = getState(storeMocks, viewType, rightContentPanelConfig);
        testObject.state = state;

        const rendered = shallow(<DetailsViewContainer {...props} />);
        expect(rendered.debug()).toMatchSnapshot();
    }
});
