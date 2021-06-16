// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, TargetAppData } from 'common/types/store-data/unified-data-interface';
import {
    DetailsViewCommandBarDeps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import { FluentSideNav } from 'DetailsView/components/left-nav/fluent-side-nav';
import { StartOverComponentFactory } from 'DetailsView/components/start-over-component-factory';
import { shallow } from 'enzyme';
import * as React from 'react';

import { IMock, Mock } from 'typemoq';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { NamedFC, ReactFCWithDisplayName } from '../../../../common/react/named-fc';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
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
import { DetailsViewBody, DetailsViewBodyProps } from '../../../../DetailsView/details-view-body';
import { DetailsViewToggleClickHandlerFactory } from '../../../../DetailsView/handlers/details-view-toggle-click-handler-factory';
import { TabStoreDataBuilder } from '../../common/tab-store-data-builder';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';
import { exampleUnifiedStatusResults } from '../common/components/cards/sample-view-model-data';

describe('DetailsViewBody', () => {
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
            const CommandBarStub: Readonly<ReactFCWithDisplayName<DetailsViewCommandBarProps>> =
                NamedFC<DetailsViewCommandBarProps>('test', _ => null);
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
                cardsViewData: {
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
            const wrapper = shallow(<DetailsViewBody {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();

            wrapper.find(FluentSideNav).props().onRightPanelContentSwitch();
        });

        test('onRightPanelContentSwitch calls setSideNavOpen with false', () => {
            const wrapper = shallow(<DetailsViewBody {...props} />);
            setSideNavOpenMock.setup(sm => sm(false)).verifiable();

            wrapper.find(FluentSideNav).props().onRightPanelContentSwitch();

            setSideNavOpenMock.verifyAll();
        });
    });
});
