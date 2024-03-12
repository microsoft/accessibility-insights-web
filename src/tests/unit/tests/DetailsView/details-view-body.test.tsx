// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { ScanMetadata, TargetAppData } from 'common/types/store-data/unified-data-interface';
import { DetailsViewCommandBarDeps } from 'DetailsView/components/details-view-command-bar';
import { FluentSideNav } from 'DetailsView/components/left-nav/fluent-side-nav';
import { StartOverComponentFactory } from 'DetailsView/components/start-over-component-factory';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { NamedFC, ReactFCWithDisplayName } from '../../../../common/react/named-fc';
import {
    AssessmentData,
    AssessmentNavState,
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import {
    DetailsRightPanelConfiguration,
    RightPanelProps,
} from '../../../../DetailsView/components/details-view-right-panel';
import {
    DetailsViewSwitcherNavConfiguration,
    LeftNavProps,
} from '../../../../DetailsView/components/details-view-switcher-nav';
import { QuickAssessCommandBar } from '../../../../DetailsView/components/quick-assess-command-bar';
import { QuickAssessToAssessmentDialog } from '../../../../DetailsView/components/quick-assess-to-assessment-dialog';
import { TargetPageHiddenBar } from '../../../../DetailsView/components/target-page-hidden-bar';
import { DetailsViewBody, DetailsViewBodyProps } from '../../../../DetailsView/details-view-body';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { TabStoreDataBuilder } from '../../common/tab-store-data-builder';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../mock-helpers/mock-module-helpers';
import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';
jest.mock('DetailsView/components/left-nav/fluent-side-nav');
jest.mock('../../../../DetailsView/components/quick-assess-to-assessment-dialog');
jest.mock('../../../../DetailsView/components/quick-assess-command-bar');
jest.mock('../../../../DetailsView/components/target-page-hidden-bar');
describe('DetailsViewBody', () => {
    mockReactComponents([
        FluentSideNav,
        QuickAssessToAssessmentDialog,
        QuickAssessCommandBar,
        TargetPageHiddenBar,
    ]);
    let selectedTest: VisualizationType;
    let configFactoryStub: VisualizationConfigurationFactory;
    let clickHandlerFactoryStub: DetailsViewToggleClickHandlerFactory;
    let props: DetailsViewBodyProps;
    let rightPanelConfig: DetailsRightPanelConfiguration;
    let switcherNavConfig: DetailsViewSwitcherNavConfiguration;
    let targetAppInfoStub: TargetAppData;
    let setSideNavOpenMock: IMock<React.Dispatch<React.SetStateAction<boolean>>>;

    describe('render', () => {
        beforeEach(() => {
            setSideNavOpenMock = Mock.ofInstance(() => {});
            selectedTest = -1;
            const RightPanelStub: Readonly<ReactFCWithDisplayName<RightPanelProps>> =
                NamedFC<RightPanelProps>('test', _ => null);
            const CommandBarStub = QuickAssessCommandBar;
            const LeftNavStub: Readonly<ReactFCWithDisplayName<LeftNavProps>> =
                NamedFC<LeftNavProps>('test', _ => null);
            rightPanelConfig = {
                RightPanel: RightPanelStub,
            } as DetailsRightPanelConfiguration;
            switcherNavConfig = {
                CommandBar: CommandBarStub,
                ReportExportDialogFactory: p => null,
                StartOverComponentFactory: {} as StartOverComponentFactory,
                LeftNav: LeftNavStub,
            } as DetailsViewSwitcherNavConfiguration;
            configFactoryStub = {} as VisualizationConfigurationFactory;
            clickHandlerFactoryStub = {} as DetailsViewToggleClickHandlerFactory;
            targetAppInfoStub = {
                name: 'name',
                url: 'url',
            } as TargetAppData;

            const assessmentStoreData = {
                assessmentNavState: {
                    selectedTestSubview: 'sample test step',
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
                    detailsViewActionMessageCreator: {} as DetailsViewActionMessageCreator,
                } as DetailsViewCommandBarDeps,
                tabStoreData: new TabStoreDataBuilder().build(),
                visualizationStoreData: new VisualizationStoreDataBuilder().build(),
                visualizationScanResultData: new VisualizationScanResultStoreDataBuilder().build(),
                tabStopsViewStoreData: { failureInstanceState: {} } as TabStopsViewStoreData,
                dataTransferViewStoreData: { showQuickAssessToAssessmentConfirmDialog: true },
                featureFlagStoreData: {} as FeatureFlagStoreData,
                selectedTest: selectedTest,
                visualizationConfigurationFactory: configFactoryStub,
                clickHandlerFactory: clickHandlerFactoryStub,
                assessmentStoreData: assessmentStoreData,
                detailsViewStoreData: {
                    detailsViewRightContentPanel: 'Overview',
                },
                rightPanelConfiguration: rightPanelConfig,
                switcherNavConfiguration: switcherNavConfig,
                automatedChecksCardsViewData: {
                    cards: exampleUnifiedStatusResults,
                    visualHelperEnabled: true,
                    allCardsCollapsed: true,
                },
                scanMetadata: {
                    targetAppInfo: targetAppInfoStub,
                } as ScanMetadata,
                isSideNavOpen: false,
                setSideNavOpen: setSideNavOpenMock.object,
                narrowModeStatus: { isHeaderAndNavCollapsed: false },
            } as DetailsViewBodyProps;
        });

        test('render', () => {
            const renderResult = render(<DetailsViewBody {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([
                FluentSideNav,
                QuickAssessCommandBar,
                TargetPageHiddenBar,
            ]);

            getMockComponentClassPropsForCall(FluentSideNav).onRightPanelContentSwitch();
        });

        test('onRightPanelContentSwitch calls setSideNavOpen with false', () => {
            render(<DetailsViewBody {...props} />);
            setSideNavOpenMock.setup(sm => sm(false)).verifiable();

            getMockComponentClassPropsForCall(FluentSideNav).onRightPanelContentSwitch();

            setSideNavOpenMock.verifyAll();
        });
    });
});
