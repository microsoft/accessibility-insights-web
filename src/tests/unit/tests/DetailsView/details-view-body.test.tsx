// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

import { getDefaultFeatureFlagsWeb } from 'common/feature-flags';
import { DetailsViewCommandBarDeps } from 'DetailsView/components/details-view-command-bar';
import { VisualizationConfiguration } from '../../../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { NamedFC, ReactFCWithDisplayName } from '../../../../common/react/named-fc';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import {
    AssessmentData,
    AssessmentNavState,
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../common/types/store-data/assessment-result-data';
import {
    ScanData,
    TestsEnabledState,
} from '../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from '../../../../DetailsView/components/details-view-right-panel';
import { DetailsViewSwitcherNavConfiguration } from '../../../../DetailsView/components/details-view-switcher-nav';
import { DetailsViewLeftNav } from '../../../../DetailsView/components/left-nav/details-view-left-nav';
import { TargetPageHiddenBar } from '../../../../DetailsView/components/target-page-hidden-bar';
import { DetailsViewBody, DetailsViewBodyProps } from '../../../../DetailsView/details-view-body';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { TabStoreDataBuilder } from '../../common/tab-store-data-builder';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';
import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';

describe('DetailsViewBody', () => {
    let selectedTest: VisualizationType;
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let clickHandlerStub: (event: any) => void;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let configStub: VisualizationConfiguration;
    let scanDataStub: ScanData;
    let props: DetailsViewBodyProps;
    let rightPanelConfig: DetailsRightPanelConfiguration;
    let switcherNavConfig: DetailsViewSwitcherNavConfiguration;
    let targetAppInfoStub: TargetAppData;

    describe('render', () => {
        beforeEach(() => {
            selectedTest = -1;
            const RightPanelStub: Readonly<ReactFCWithDisplayName<DetailsViewBodyProps>> = NamedFC<
                DetailsViewBodyProps
            >('test', _ => null);
            const CommandBarStub: Readonly<ReactFCWithDisplayName<DetailsViewBodyProps>> = NamedFC<
                DetailsViewBodyProps
            >('test', _ => null);
            const LeftNavStub: Readonly<ReactFCWithDisplayName<DetailsViewBodyProps>> = NamedFC<
                DetailsViewBodyProps
            >('test', _ => null);
            rightPanelConfig = {
                RightPanel: RightPanelStub,
            } as DetailsRightPanelConfiguration;
            switcherNavConfig = {
                CommandBar: CommandBarStub,
                ReportExportComponentFactory: p => null,
                StartOverComponentFactory: p => null,
                LeftNav: LeftNavStub,
            } as DetailsViewSwitcherNavConfiguration;
            configFactoryMock = Mock.ofType(VisualizationConfigurationFactory, MockBehavior.Strict);
            clickHandlerFactoryMock = Mock.ofType(
                DetailsViewToggleClickHandlerFactory,
                MockBehavior.Strict,
            );
            getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);

            configStub = {
                getStoreData: getStoreDataMock.object,
                displayableData: {},
            } as VisualizationConfiguration;

            scanDataStub = {
                enabled: false,
            } as ScanData;

            targetAppInfoStub = {
                name: 'name',
                url: 'url',
            } as TargetAppData;

            clickHandlerStub = () => {};

            const assessmentStoreData = {
                assessmentNavState: {
                    selectedTestStep: 'sample test step',
                } as AssessmentNavState,
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
                    } as AssessmentData,
                },
                persistedTabInfo: {} as PersistedTabInfo,
                resultDescription: '',
            } as AssessmentStoreData;

            props = {
                deps: {
                    detailsViewActionMessageCreator: Mock.ofType(DetailsViewActionMessageCreator)
                        .object,
                } as DetailsViewCommandBarDeps,
                tabStoreData: new TabStoreDataBuilder().build(),
                visualizationStoreData: new VisualizationStoreDataBuilder().build(),
                visualizationScanResultData: new VisualizationScanResultStoreDataBuilder().build(),
                featureFlagStoreData: getDefaultFeatureFlagsWeb(),
                selectedTest: selectedTest,
                visualizationConfigurationFactory: configFactoryMock.object,
                clickHandlerFactory: clickHandlerFactoryMock.object,
                assessmentStoreData: assessmentStoreData,
                detailsViewStoreData: {
                    detailsViewRightContentPanel: 'Overview',
                },
                rightPanelConfiguration: rightPanelConfig,
                switcherNavConfiguration: switcherNavConfig,
                cardsViewData: {
                    cards: exampleUnifiedStatusResults,
                    visualHelperEnabled: true,
                    allCardsCollapsed: true,
                },
                scanMetaData: {
                    targetAppInfo: targetAppInfoStub,
                } as ScanMetaData,
            } as DetailsViewBodyProps;
        });

        test('a non-assessment or non-issues view', () => {
            setupClickHandlerFactoryMock(
                clickHandlerFactoryMock,
                selectedTest,
                !scanDataStub.enabled,
            );
            setupConfigFactoryMock(
                configFactoryMock,
                getStoreDataMock,
                configStub,
                scanDataStub,
                props,
            );

            const expected = (
                <div className="details-view-body">
                    {buildCommandBar(props)}
                    <div className="details-view-body-nav-content-layout">
                        {buildLeftNav(props)}
                        <div className="details-view-body-content-pane">
                            {buildTargetPageInfoBar(props)}
                            <div className="view" role="main">
                                {buildRightPanel(props)}
                            </div>
                        </div>
                    </div>
                </div>
            );

            const testSubject = new DetailsViewBody(props);
            const actual = testSubject.render();
            expect(actual).toEqual(expected);
        });
    });

    function setupConfigFactoryMock(
        factoryMock: IMock<VisualizationConfigurationFactory>,
        givenGetStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>,
        config: VisualizationConfiguration,
        scanData: ScanData,
        givenProps: DetailsViewBodyProps,
    ): void {
        factoryMock
            .setup(cfm => cfm.getConfiguration(givenProps.selectedTest))
            .returns(() => config);

        givenGetStoreDataMock
            .setup(gsdm => gsdm(givenProps.visualizationStoreData.tests))
            .returns(() => scanData);
    }

    function setupClickHandlerFactoryMock(
        factoryMock: IMock<DetailsViewToggleClickHandlerFactory>,
        setupType: VisualizationType,
        setupNewValue: boolean,
    ): void {
        factoryMock
            .setup(chfm => chfm.createClickHandler(setupType, setupNewValue))
            .returns(() => clickHandlerStub);
    }

    function buildLeftNav(givenProps: DetailsViewBodyProps): JSX.Element {
        return <DetailsViewLeftNav {...givenProps} />;
    }

    function buildTargetPageInfoBar(givenProps: DetailsViewBodyProps): JSX.Element {
        return <TargetPageHiddenBar isTargetPageHidden={givenProps.tabStoreData.isPageHidden} />;
    }

    function buildCommandBar(givenProps: DetailsViewBodyProps): JSX.Element {
        return <switcherNavConfig.CommandBar {...givenProps} />;
    }

    function buildRightPanel(givenProps: DetailsViewBodyProps): JSX.Element {
        const rightPanelProps = {
            targetAppInfo: givenProps.scanMetaData.targetAppInfo,
            ...givenProps,
        };
        return <rightPanelConfig.RightPanel {...rightPanelProps} />;
    }
});
