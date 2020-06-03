// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import {
    CardSelectionViewData,
    GetCardSelectionViewData,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { StoreActionMessageCreator } from 'common/message-creators/store-action-message-creator';
import { StoreActionMessageCreatorImpl } from 'common/message-creators/store-action-message-creator-impl';
import { GetCardViewData } from 'common/rule-based-view-model-provider';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    TargetAppData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { DetailsViewOverlay } from 'DetailsView/components/details-view-overlay/details-view-overlay';
import {
    DetailsRightPanelConfiguration,
    GetDetailsRightPanelConfiguration,
    GetDetailsRightPanelConfigurationProps,
} from 'DetailsView/components/details-view-right-panel';
import {
    DetailsViewSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfiguration,
    GetDetailsSwitcherNavConfigurationProps,
} from 'DetailsView/components/details-view-switcher-nav';
import { InteractiveHeader } from 'DetailsView/components/interactive-header';
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { GetSelectedDetailsViewProps } from 'DetailsView/components/left-nav/get-selected-details-view';
import { DetailsViewBody } from 'DetailsView/details-view-body';
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
    let getDetailsRightPanelConfiguration: IMock<GetDetailsRightPanelConfiguration>;
    let getDetailsSwitcherNavConfiguration: IMock<GetDetailsSwitcherNavConfiguration>;
    let getCardViewDataMock: IMock<GetCardViewData>;
    let getCardSelectionViewDataMock: IMock<GetCardSelectionViewData>;
    let targetAppInfo: TargetAppData;
    let isResultHighlightUnavailableStub: IsResultHighlightUnavailable;
    let timestamp: string;
    let toolData: ToolData;

    beforeEach(() => {
        detailsViewActionMessageCreator = Mock.ofType<DetailsViewActionMessageCreator>();
        getDetailsRightPanelConfiguration = Mock.ofInstance(
            (props: GetDetailsRightPanelConfigurationProps) => null,
            MockBehavior.Strict,
        );
        getDetailsSwitcherNavConfiguration = Mock.ofInstance(
            (props: GetDetailsSwitcherNavConfigurationProps) => null,
            MockBehavior.Strict,
        );
        getCardViewDataMock = Mock.ofInstance(
            (
                rules: UnifiedRule[],
                results: UnifiedResult[],
                cardSelectionViewData: CardSelectionViewData,
            ) => null,
            MockBehavior.Strict,
        );
        getCardSelectionViewDataMock = Mock.ofInstance(
            (storeData: CardSelectionStoreData) => null,
            MockBehavior.Strict,
        );
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
            getDetailsRightPanelConfiguration: getDetailsRightPanelConfiguration.object,
            getDetailsSwitcherNavConfiguration: getDetailsSwitcherNavConfiguration.object,
            getCardViewData: getCardViewDataMock.object,
            getCardSelectionViewData: getCardSelectionViewDataMock.object,
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

        it('render twice; should not call details view opened on 2nd render', () => {
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
            const switcherNavConfig = {
                getSelectedDetailsView: getSelectedDetailsViewMock.object,
            } as DetailsViewSwitcherNavConfiguration;

            const visualizationStoreData = new VisualizationStoreDataBuilder().build();
            const detailsViewState = new DetailsViewStoreDataBuilder()
                .withDetailsViewRightContentPanel(rightContentPanelType)
                .build();
            const tabStoreData = new TabStoreDataBuilder().with('isClosed', false).build();

            setupGetDetailsRightPanelConfiguration(
                rightContentPanelType,
                visualizationStoreData.selectedDetailsViewPivot,
                null,
            );
            setupGetSwitcherNavConfiguration(
                visualizationStoreData.selectedDetailsViewPivot,
                switcherNavConfig,
            );
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

            const cardViewData: CardsViewModel = {
                cards: {},
                visualHelperEnabled: true,
                allCardsCollapsed: true,
            } as CardsViewModel;
            const cardSelectionViewData: CardSelectionViewData = {} as CardSelectionViewData;
            getCardSelectionViewDataMock
                .setup(g =>
                    g(
                        state.cardSelectionStoreData,
                        state.unifiedScanResultStoreData,
                        isResultHighlightUnavailableStub,
                    ),
                )
                .returns(() => cardSelectionViewData);
            getCardViewDataMock
                .setup(m =>
                    m(
                        state.unifiedScanResultStoreData.rules,
                        state.unifiedScanResultStoreData.results,
                        cardSelectionViewData,
                    ),
                )
                .returns(() => cardViewData);

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

    function buildDetailsViewBody(
        storeMocks: StoreMocks,
        props: DetailsViewContainerProps,
        selectedDetailsView: VisualizationType,
        rightPanelConfiguration: DetailsRightPanelConfiguration,
        switcherNavConfiguration: DetailsViewSwitcherNavConfiguration,
        cardsViewData: CardsViewModel,
        targetApp: TargetAppData,
    ): JSX.Element {
        const scanMetadata = {
            timestamp: timestamp,
            toolData: toolData,
            targetAppInfo: targetApp,
        };
        return (
            <DetailsViewBody
                deps={deps}
                tabStoreData={storeMocks.tabStoreData}
                assessmentStoreData={storeMocks.assessmentStoreData}
                pathSnippetStoreData={storeMocks.pathSnippetStoreData}
                featureFlagStoreData={storeMocks.featureFlagStoreData}
                selectedTest={selectedDetailsView}
                detailsViewStoreData={storeMocks.detailsViewStoreData}
                visualizationStoreData={storeMocks.visualizationStoreData}
                visualizationScanResultData={storeMocks.visualizationScanResultsStoreData}
                visualizationConfigurationFactory={props.deps.visualizationConfigurationFactory}
                assessmentsProvider={props.deps.assessmentsProvider}
                dropdownClickHandler={props.deps.dropdownClickHandler}
                clickHandlerFactory={props.deps.clickHandlerFactory}
                assessmentInstanceTableHandler={props.deps.assessmentInstanceTableHandler}
                issuesSelection={props.deps.issuesSelection}
                issuesTableHandler={props.deps.issuesTableHandler}
                rightPanelConfiguration={rightPanelConfiguration}
                switcherNavConfiguration={switcherNavConfiguration}
                userConfigurationStoreData={storeMocks.userConfigurationStoreData}
                cardsViewData={cardsViewData}
                cardSelectionStoreData={storeMocks.cardSelectionStoreData}
                scanIncompleteWarnings={
                    storeMocks.unifiedScanResultStoreData.scanIncompleteWarnings
                }
                scanMetadata={scanMetadata}
            />
        );
    }

    function setupGetDetailsRightPanelConfiguration(
        contentPanelType: DetailsViewRightContentPanelType,
        selectedPivot: DetailsViewPivotType,
        returnConfiguration: DetailsRightPanelConfiguration,
    ): void {
        const expected: GetDetailsRightPanelConfigurationProps = {
            selectedDetailsViewPivot: selectedPivot,
            detailsViewRightContentPanel: contentPanelType,
        };
        getDetailsRightPanelConfiguration
            .setup(gtrpc => gtrpc(It.isValue(expected)))
            .returns(() => returnConfiguration);
    }

    function setupGetSwitcherNavConfiguration(
        selectedPivot: DetailsViewPivotType,
        returnConfiguration: DetailsViewSwitcherNavConfiguration,
    ): void {
        const expected: GetDetailsSwitcherNavConfigurationProps = {
            selectedDetailsViewPivot: selectedPivot,
        };
        getDetailsSwitcherNavConfiguration
            .setup(gtrpc => gtrpc(It.isValue(expected)))
            .returns(() => returnConfiguration);
    }

    function buildOverlay(storeMocks: StoreMocks, props: DetailsViewContainerProps): JSX.Element {
        return (
            <DetailsViewOverlay
                deps={props.deps}
                previewFeatureFlagsHandler={props.deps.previewFeatureFlagsHandler}
                scopingActionMessageCreator={props.deps.scopingActionMessageCreator}
                inspectActionMessageCreator={props.deps.inspectActionMessageCreator}
                detailsViewStoreData={storeMocks.detailsViewStoreData}
                scopingStoreData={storeMocks.scopingStoreData}
                featureFlagStoreData={storeMocks.featureFlagStoreData}
                userConfigurationStoreData={storeMocks.userConfigurationStoreData}
            />
        );
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
            permissionsStateStoreData: storeMocks.permissionsStateStoreData,
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
        };
    }

    function testRenderStaticContent(
        viewType: VisualizationType,
        isPreviewFeaturesOpen: boolean,
    ): void {
        const clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory);
        const dropdownClickHandler = Mock.ofType(DropdownClickHandler);
        const getSelectedDetailsViewMock = Mock.ofInstance(
            (theProps: GetSelectedDetailsViewProps) => null,
            MockBehavior.Strict,
        );
        const rightContentPanelType = 'TestView';
        const rightContentPanelConfig = {} as DetailsRightPanelConfiguration;
        const switcherNavConfig = {
            getSelectedDetailsView: getSelectedDetailsViewMock.object,
        } as DetailsViewSwitcherNavConfiguration;

        const visualizationStoreData = new VisualizationStoreDataBuilder()
            .withSelectedDetailsViewPivot(DetailsViewPivotType.fastPass)
            .with('selectedAdhocDetailsView', viewType)
            .build();

        setupActionMessageCreatorMock(
            detailsViewActionMessageCreator,
            visualizationStoreData.selectedDetailsViewPivot,
            1,
        );

        setupGetDetailsRightPanelConfiguration(
            rightContentPanelType,
            visualizationStoreData.selectedDetailsViewPivot,
            rightContentPanelConfig,
        );

        setupGetSwitcherNavConfiguration(
            visualizationStoreData.selectedDetailsViewPivot,
            switcherNavConfig,
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

        const cardSelectionViewData: CardSelectionViewData = {} as CardSelectionViewData;
        getCardSelectionViewDataMock
            .setup(g =>
                g(
                    state.cardSelectionStoreData,
                    state.unifiedScanResultStoreData,
                    isResultHighlightUnavailableStub,
                ),
            )
            .returns(() => cardSelectionViewData)
            .verifiable(Times.once());

        const cardsViewData: CardsViewModel = {} as any;
        getCardViewDataMock
            .setup(m =>
                m(
                    state.unifiedScanResultStoreData.rules,
                    state.unifiedScanResultStoreData.results,
                    cardSelectionViewData,
                ),
            )
            .returns(() => cardsViewData);

        const expected: JSX.Element = (
            <>
                <InteractiveHeader
                    deps={props.deps}
                    selectedPivot={DetailsViewPivotType.fastPass}
                    featureFlagStoreData={storeMocks.featureFlagStoreData}
                    tabClosed={storeMocks.tabStoreData.isClosed}
                />
                {buildDetailsViewBody(
                    storeMocks,
                    props,
                    viewType,
                    rightContentPanelConfig,
                    switcherNavConfig,
                    cardsViewData,
                    targetAppInfo,
                )}
                {buildOverlay(storeMocks, props)}
            </>
        );

        expect(testObject.render()).toEqual(expected);

        clickHandlerFactoryMock.verifyAll();
        getCardSelectionViewDataMock.verifyAll();
    }
});
