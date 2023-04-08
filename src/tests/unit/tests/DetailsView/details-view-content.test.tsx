// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import {
    CardSelectionViewData,
    GetCardSelectionViewData,
} from 'common/get-card-selection-view-data';
import { GetCardViewData } from 'common/rule-based-view-model-provider';
import {
    convertAssessmentStoreDataToScanNodeResults,
    ConvertAssessmentStoreDataToScanNodeResultsCallback,
    convertUnifiedStoreDataToScanNodeResults,
    ConvertUnifiedStoreDataToScanNodeResultsCallback,
    ScanNodeResult,
} from 'common/store-data-to-scan-node-result-converter';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import {
    TargetAppData,
    ToolData,
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
import { GetSelectedAssessmentCardSelectionStoreData } from 'DetailsView/components/left-nav/get-selected-assessment-card-selection-store-data';
import { GetSelectedAssessmentStoreData } from 'DetailsView/components/left-nav/get-selected-assessment-store-data';
import { GetSelectedDetailsViewProps } from 'DetailsView/components/left-nav/get-selected-details-view';
import {
    DetailsViewContainerDeps,
    DetailsViewContainerState,
} from 'DetailsView/details-view-container';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ScannerRuleInfoMap } from 'scanner/scanner-rule-info';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { DetailsViewStoreDataBuilder } from '../../common/details-view-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import { DetailsViewContainerPropsBuilder } from './details-view-container-props-builder';
import { StoreMocks } from './store-mocks';

describe(DetailsViewContent.displayName, () => {
    const pageTitle = 'DetailsViewContainerTest title';
    const pageUrl = 'http://detailsViewContainerTest/url/';
    let detailsViewActionMessageCreator: IMock<DetailsViewActionMessageCreator>;
    let deps: DetailsViewContainerDeps;
    let getDetailsRightPanelConfiguration: IMock<GetDetailsRightPanelConfiguration>;
    let getDetailsSwitcherNavConfiguration: IMock<GetDetailsSwitcherNavConfiguration>;
    let visualizationConfigurationFactoryMock: IMock<VisualizationConfigurationFactory>;
    let getCardViewDataMock: IMock<GetCardViewData>;
    let convertUnifiedStoreDataToScanNodeResultsMock: IMock<ConvertUnifiedStoreDataToScanNodeResultsCallback>;
    let convertAssessmentStoreDataToScanNodeResultsMock: IMock<ConvertAssessmentStoreDataToScanNodeResultsCallback>;
    let getCardSelectionViewDataMock: IMock<GetCardSelectionViewData>;
    let targetAppInfo: TargetAppData;
    let timestamp: string;
    let scanDate: Date;
    let toolData: ToolData;
    let getDateFromTimestampMock: IMock<(timestamp: string) => Date>;
    let defaultRulesMapStub: ScannerRuleInfoMap;

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
            (scanNodeResults: ScanNodeResult[], cardSelectionViewData?: CardSelectionViewData) =>
                null,
            MockBehavior.Strict,
        );
        convertAssessmentStoreDataToScanNodeResultsMock = Mock.ofInstance(
            convertAssessmentStoreDataToScanNodeResults,
            MockBehavior.Strict,
        );
        convertUnifiedStoreDataToScanNodeResultsMock = Mock.ofInstance(
            convertUnifiedStoreDataToScanNodeResults,
            MockBehavior.Strict,
        );
        getCardSelectionViewDataMock = Mock.ofInstance(
            (storeData: CardSelectionStoreData) => null,
            MockBehavior.Strict,
        );
        visualizationConfigurationFactoryMock = Mock.ofType(
            WebVisualizationConfigurationFactory,
            MockBehavior.Strict,
        );
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
        defaultRulesMapStub = {
            'some-rule': {
                id: 'some-rule',
                help: 'some help',
                a11yCriteria: null,
            },
        };

        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);

        deps = {
            detailsViewActionMessageCreator: detailsViewActionMessageCreator.object,
            getDetailsRightPanelConfiguration: getDetailsRightPanelConfiguration.object,
            getDetailsSwitcherNavConfiguration: getDetailsSwitcherNavConfiguration.object,
            getCardViewData: getCardViewDataMock.object,
            getCardSelectionViewData: getCardSelectionViewDataMock.object,
            getDateFromTimestamp: getDateFromTimestampMock.object,
            getAssessmentInstanceTableHandler: () => assessmentInstanceTableHandlerMock.object,
            visualizationConfigurationFactory: visualizationConfigurationFactoryMock.object,
            convertUnifiedStoreDataToScanNodeResults:
                convertUnifiedStoreDataToScanNodeResultsMock.object,
            convertAssessmentStoreDataToScanNodeResults:
                convertAssessmentStoreDataToScanNodeResultsMock.object,
            defaultRulesMap: defaultRulesMapStub,
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
            const getSelectedAssessmentStoreDataMock = Mock.ofInstance(
                (() => null) as GetSelectedAssessmentStoreData,
            );
            const getSelectedAssessmentCardSelectionStoreDataMock = Mock.ofInstance(
                (() => null) as GetSelectedAssessmentCardSelectionStoreData,
            );

            const rightContentPanelType = 'TestView';
            const rightContentPanelConfig = {} as DetailsRightPanelConfiguration;
            const switcherNavConfig = {
                getSelectedDetailsView: getSelectedDetailsViewMock.object,
                getSelectedAssessmentStoreData: getSelectedAssessmentStoreDataMock.object,
                getSelectedAssessmentCardSelectionStoreData:
                    getSelectedAssessmentCardSelectionStoreDataMock.object,
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
                showAutoDetectedFailuresDialog: true,
                showSaveAssessmentDialog: true,
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
                .setUnifiedScanResultStoreData(unifiedScanResultStoreData)
                .setNeedsReviewScanResultStoreData(unifiedScanResultStoreData);

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
                            quickAssessStoreData: state.quickAssessStoreData,
                        }),
                    ),
                )
                .returns(() => viewType);

            getSelectedAssessmentStoreDataMock
                .setup(m =>
                    m(
                        It.isObjectWith({
                            assessmentStoreData: state.assessmentStoreData,
                            quickAssessStoreData: state.quickAssessStoreData,
                        }),
                    ),
                )
                .returns(() => {
                    return state.assessmentStoreData;
                });

            getSelectedAssessmentCardSelectionStoreDataMock
                .setup(m =>
                    m(
                        It.isObjectWith({
                            assessmentCardSelectionStoreData:
                                state.assessmentCardSelectionStoreData,
                            quickAssessCardSelectionStoreData:
                                state.quickAssessCardSelectionStoreData,
                        }),
                    ),
                )
                .returns(() => {
                    return state.assessmentCardSelectionStoreData;
                });

            const cardSelectionViewData: CardSelectionViewData = {} as CardSelectionViewData;
            getCardSelectionViewDataMock
                .setup(g =>
                    g(
                        state.cardSelectionStoreData,
                        state.unifiedScanResultStoreData.results,
                        state.unifiedScanResultStoreData.platformInfo,
                    ),
                )
                .returns(() => cardSelectionViewData)
                .verifiable(Times.exactly(2));

            const configStub = { key: 'test-key' } as VisualizationConfiguration;
            visualizationConfigurationFactoryMock
                .setup(vcfm => vcfm.getConfiguration(viewType))
                .returns(() => configStub);

            const unifiedCardsViewDataStub: CardsViewModel = {
                allCardsCollapsed: false,
            } as CardsViewModel;
            const needsReviewCardsViewDataStub: CardsViewModel = {
                allCardsCollapsed: true,
                visualHelperEnabled: true,
            } as CardsViewModel;
            const assessmentCardsViewDataStub: CardsViewModel = {
                allCardsCollapsed: true,
            } as CardsViewModel;

            const assessmentScanNodeResultsStub = [
                {
                    ruleId: 'some-assessment-rule-id',
                },
            ] as ScanNodeResult[];
            const unifiedScanNodeResultsStub = [
                {
                    ruleId: 'some-unified-scan-rule-id',
                },
            ] as ScanNodeResult[];
            const needsReviewScanNodeResultsStub = [
                {
                    ruleId: 'some-needs-review-rule-id',
                },
            ] as ScanNodeResult[];

            convertUnifiedStoreDataToScanNodeResultsMock
                .setup(m => m(state.unifiedScanResultStoreData))
                .returns(() => unifiedScanNodeResultsStub);
            convertUnifiedStoreDataToScanNodeResultsMock
                .setup(m => m(state.needsReviewScanResultStoreData))
                .returns(() => needsReviewScanNodeResultsStub);

            getCardSelectionViewDataMock
                .setup(g => g(undefined, assessmentScanNodeResultsStub, null))
                .returns(() => cardSelectionViewData)
                .verifiable(Times.exactly(1));

            convertAssessmentStoreDataToScanNodeResultsMock
                .setup(m =>
                    m(
                        state.assessmentStoreData,
                        configStub.key,
                        state.assessmentCardSelectionStoreData[configStub.key],
                        defaultRulesMapStub,
                    ),
                )
                .returns(() => assessmentScanNodeResultsStub);

            getCardViewDataMock
                .setup(m => m(assessmentScanNodeResultsStub, cardSelectionViewData))
                .returns(() => assessmentCardsViewDataStub);

            getCardViewDataMock
                .setup(m => m(unifiedScanNodeResultsStub, cardSelectionViewData))
                .returns(() => unifiedCardsViewDataStub);

            getCardViewDataMock
                .setup(m => m(needsReviewScanNodeResultsStub, cardSelectionViewData))
                .returns(() => needsReviewCardsViewDataStub);

            const rendered = shallow(
                <DetailsViewContent
                    {...props}
                    narrowModeStatus={{
                        isHeaderAndNavCollapsed: false,
                        isCommandBarCollapsed: false,
                        isVirtualKeyboardCollapsed: false,
                        isCardFooterCollapsed: false,
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
    ): IMock<ClientStoresHub<any>> {
        const storesHubMock = Mock.ofType(ClientStoresHub);
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
                        quickAssessStoreData: storeMocks.quickAssessStoreData,
                        pathSnippetStoreData: storeMocks.pathSnippetStoreData,
                        scopingPanelStateStoreData: storeMocks.scopingStoreData,
                        userConfigurationStoreData: storeMocks.userConfigurationStoreData,
                        unifiedScanResultStoreData: storeMocks.unifiedScanResultStoreData,
                        assessmentCardSelectionStoreData:
                            storeMocks.assessmentCardSelectionStoreData,
                        quickAssessCardSelectionStoreData:
                            storeMocks.quickAssessCardSelectionStoreData,
                        needsReviewScanResultStoreData: storeMocks.needsReviewScanResultStoreData,
                        needsReviewCardSelectionStoreData:
                            storeMocks.needsReviewCardSelectionStoreData,
                        cardSelectionStoreData: storeMocks.cardSelectionStoreData,
                        tabStopsViewStoreData: storeMocks.tabStopsViewStoreData,
                        dataTransferViewStoreData: storeMocks.dataTransferViewStoreData,
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
            needsReviewScanResultStoreData: storeMocks.needsReviewScanResultStoreData,
            assessmentCardSelectionStoreData: storeMocks.assessmentCardSelectionStoreData,
            quickAssessCardSelectionStoreData: storeMocks.quickAssessCardSelectionStoreData,
            selectedDetailsView: viewType,
            selectedDetailsRightPanelConfiguration: rightPanel,
            cardSelectionStoreData: storeMocks.cardSelectionStoreData,
            needsReviewCardSelectionStoreData: storeMocks.needsReviewCardSelectionStoreData,
            permissionsStateStoreData: storeMocks.permissionsStateStoreData,
            tabStopsViewStoreData: storeMocks.tabStopsViewStoreData,
            cardsViewStoreData: storeMocks.cardsViewStoreData,
            quickAssessStoreData: storeMocks.quickAssessStoreData,
            dataTransferViewStoreData: storeMocks.dataTransferViewStoreData,
        };
    }
});
