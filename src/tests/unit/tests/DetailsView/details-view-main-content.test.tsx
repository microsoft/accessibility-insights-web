// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { FeatureFlagStore } from '../../../../background/stores/global/feature-flag-store';
import {
    IVisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../common/configs/visualization-configuration-factory';
import { NamedSFC, ReactSFCWithDisplayName } from '../../../../common/react/named-sfc';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import { IAssessmentData, IAssessmentNavState, IAssessmentStoreData } from '../../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../../common/types/store-data/itab-store-data';
import { IScanData, ITestsEnabledState } from '../../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from '../../../../DetailsView/components/details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration } from '../../../../DetailsView/components/details-view-switcher-nav';
import { DetailsViewLeftNav } from '../../../../DetailsView/components/left-nav/details-view-left-nav';
import { TabInfo } from '../../../../DetailsView/components/tab-info';
import { DetailsViewMainContent, IDetailsViewMainContentProps } from '../../../../DetailsView/details-view-main-content';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { TabStoreDataBuilder } from '../../common/tab-store-data-builder';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

describe('DetailsViewMainContentTest', () => {
    let selectedTest: VisualizationType;
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let clickHandlerStub: (event: any) => void;
    let getStoreDataMock: IMock<(data: ITestsEnabledState) => IScanData>;
    let configStub: IVisualizationConfiguration;
    let scanDataStub: IScanData;
    let props: IDetailsViewMainContentProps;
    let rightPanelConfig: DetailsRightPanelConfiguration;
    let switcherNavConfig: DetailsViewSwitcherNavConfiguration;

    describe('render', () => {
        beforeEach(() => {
            selectedTest = -1;
            const RightPanelStub: Readonly<ReactSFCWithDisplayName<IDetailsViewMainContentProps>> = NamedSFC<IDetailsViewMainContentProps>(
                'test',
                _ => null,
            );
            const CommandBarStub: Readonly<ReactSFCWithDisplayName<IDetailsViewMainContentProps>> = NamedSFC<IDetailsViewMainContentProps>(
                'test',
                _ => null,
            );
            const LeftNavStub: Readonly<ReactSFCWithDisplayName<IDetailsViewMainContentProps>> = NamedSFC<IDetailsViewMainContentProps>(
                'test',
                _ => null,
            );
            rightPanelConfig = {
                RightPanel: RightPanelStub,
            } as DetailsRightPanelConfiguration;
            switcherNavConfig = {
                CommandBar: CommandBarStub,
                LeftNav: LeftNavStub,
            } as DetailsViewSwitcherNavConfiguration;
            configFactoryMock = Mock.ofType(VisualizationConfigurationFactory, MockBehavior.Strict);
            clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory, MockBehavior.Strict);
            getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);

            configStub = {
                getStoreData: getStoreDataMock.object,
                displayableData: {},
            } as IVisualizationConfiguration;

            scanDataStub = {
                enabled: false,
            } as IScanData;

            clickHandlerStub = () => {};

            const assessmentStoreData = {
                assessmentNavState: {
                    selectedTestStep: 'sample test step',
                } as IAssessmentNavState,
                assessments: {
                    assessment: {
                        testStepStatus: {
                            ['step-1']: {
                                stepFinalResult: ManualTestStatus.UNKNOWN,
                                isStepScanned: false,
                            },
                        },
                        generatedAssessmentInstancesMap: {},
                        manualTestStepResultMap: {},
                        fullAxeResultsMap: {},
                    } as IAssessmentData,
                },
                targetTab: -1,
            } as IAssessmentStoreData;

            props = {
                deps: {
                    detailsViewActionMessageCreator: Mock.ofType(DetailsViewActionMessageCreator).object,
                },
                tabStoreData: new TabStoreDataBuilder().build(),
                visualizationStoreData: new VisualizationStoreDataBuilder().build(),
                visualizationScanResultData: new VisualizationScanResultStoreDataBuilder().build(),
                featureFlagStoreData: new FeatureFlagStore(null, null, null).getDefaultState(),
                selectedTest: selectedTest,
                visualizationConfigurationFactory: configFactoryMock.object,
                clickHandlerFactory: clickHandlerFactoryMock.object,
                assessmentStoreData: assessmentStoreData,
                detailsViewStoreData: {
                    detailsViewRightContentPanel: 'Overview',
                },
                rightPanelConfiguration: rightPanelConfig,
                switcherNavConfiguration: switcherNavConfig,
            } as IDetailsViewMainContentProps;
        });

        test('tab is closed', () => {
            const tabStoreData: ITabStoreData = {
                isClosed: true,
            } as ITabStoreData;

            props.tabStoreData = tabStoreData;

            const expected = (
                <>
                    {buildCommandBar(props)}
                    <div className="table row-layout details-view-main-content">
                        {null}
                        <div className="details-content table column-layout">
                            {null}
                            <div className="view" role="main">
                                <rightPanelConfig.RightPanel {...props} />
                            </div>
                        </div>
                    </div>
                </>
            );

            const testSubject = new DetailsViewMainContent(props);
            expect(testSubject.render()).toEqual(expected);
        });

        test('a non-assessment or non-issues view', () => {
            setupClickHandlerFactoryMock(clickHandlerFactoryMock, selectedTest, !scanDataStub.enabled);
            setupConfigFactoryMock(configFactoryMock, getStoreDataMock, configStub, scanDataStub, props);

            const expected = (
                <>
                    {buildCommandBar(props)}
                    <div className="table row-layout details-view-main-content">
                        {buildLeftNav(props)}
                        <div className="details-content table column-layout">
                            {buildTabInfo(props)}
                            <div className="view" role="main">
                                <rightPanelConfig.RightPanel {...props} />
                            </div>
                        </div>
                    </div>
                </>
            );

            const testSubject = new DetailsViewMainContent(props);
            expect(testSubject.render()).toEqual(expected);
        });
    });

    function setupConfigFactoryMock(
        factoryMock: IMock<VisualizationConfigurationFactory>,
        givenGetStoreDataMock: IMock<(data: ITestsEnabledState) => IScanData>,
        config: IVisualizationConfiguration,
        scanData: IScanData,
        givenProps: IDetailsViewMainContentProps,
    ): void {
        factoryMock.setup(cfm => cfm.getConfiguration(givenProps.selectedTest)).returns(() => config);

        givenGetStoreDataMock.setup(gsdm => gsdm(givenProps.visualizationStoreData.tests)).returns(() => scanData);
    }

    function setupClickHandlerFactoryMock(
        factoryMock: IMock<DetailsViewToggleClickHandlerFactory>,
        setupType: VisualizationType,
        setupNewValue: boolean,
    ): void {
        factoryMock.setup(chfm => chfm.createClickHandler(setupType, setupNewValue)).returns(() => clickHandlerStub);
    }

    function buildLeftNav(givenProps: IDetailsViewMainContentProps): JSX.Element {
        return <DetailsViewLeftNav {...givenProps} />;
    }

    function buildTabInfo(givenProps: IDetailsViewMainContentProps): JSX.Element {
        return (
            <TabInfo
                isTargetPageHidden={givenProps.tabStoreData.isPageHidden}
                url={givenProps.tabStoreData.url}
                title={givenProps.tabStoreData.title}
                actionCreator={givenProps.deps.detailsViewActionMessageCreator}
                selectedPivot={givenProps.visualizationStoreData.selectedDetailsViewPivot}
                featureFlags={givenProps.featureFlagStoreData}
                dropdownClickHandler={givenProps.dropdownClickHandler}
            />
        );
    }

    function buildCommandBar(givenProps: IDetailsViewMainContentProps): JSX.Element {
        return <switcherNavConfig.CommandBar actionMessageCreator={props.deps.detailsViewActionMessageCreator} {...props} />;
    }
});
