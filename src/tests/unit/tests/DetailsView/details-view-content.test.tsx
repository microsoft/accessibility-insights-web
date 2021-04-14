// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import {
    CardSelectionViewData,
    GetCardSelectionViewData,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { GetCardViewData } from 'common/rule-based-view-model-provider';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
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
import { DetailsViewContent } from 'DetailsView/components/details-view-content';
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
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { GetSelectedDetailsViewProps } from 'DetailsView/components/left-nav/get-selected-details-view';
import {
    DetailsViewContainerDeps,
    DetailsViewContainerState,
} from 'DetailsView/details-view-container';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DetailsViewStoreDataBuilder } from '../../common/details-view-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import { DetailsViewContainerPropsBuilder } from './details-view-container-props-builder';
import { StoreMocks } from './store-mocks';

describe(DetailsViewContent, () => {
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
    let scanDate: Date;
    let toolData: ToolData;
    let getDateFromTimestampMock: IMock<(timestamp: string) => Date>;

    beforeEach(() => {
        detailsViewActionMessageCreator = Mock.ofType(DetailsViewActionMessageCreator);
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
        scanDate = new Date(Date.UTC(0, 1, 2, 3));
        getDateFromTimestampMock = Mock.ofInstance(() => null);
        getDateFromTimestampMock.setup(gd => gd(timestamp)).returns(() => scanDate);
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
            getDateFromTimestamp: getDateFromTimestampMock.object,
        } as DetailsViewContainerDeps;
    });

    describe('render', () => {
        it('renders normally', () => {
            const viewType = -1;
            const isPreviewFeaturesOpen = false;
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
                adbLocation: null,
                lastWindowState: null,
                lastWindowBounds: null,
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

            const state = getState(storeMocks, viewType, rightContentPanelConfig);

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

            const rendered = shallow(
                <DetailsViewContent
                    {...props}
                    narrowModeStatus={{
                        isHeaderAndNavCollapsed: false,
                        isCommandBarCollapsed: false,
                        isVirtualKeyboardCollapsed: false,
                    }}
                    isSideNavOpen={false}
                    setSideNavOpen={() => {}}
                />,
            );
            expect(rendered.getElement()).toMatchSnapshot();

            clickHandlerFactoryMock.verifyAll();
            getCardSelectionViewDataMock.verifyAll();
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
});
