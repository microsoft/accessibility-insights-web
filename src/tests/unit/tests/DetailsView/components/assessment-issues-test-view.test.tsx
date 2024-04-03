// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { NamedFC } from 'common/react/named-fc';
import { DisplayableVisualizationTypeData } from 'common/types/displayable-visualization-type-data';
import {
    AssessmentData,
    AssessmentStoreData,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AssessmentIssuesTestView,
    AssessmentIssuesTestViewProps,
} from 'DetailsView/components/assessment-issues-test-view';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { WarningConfiguration } from 'DetailsView/components/warning-configuration';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BannerWarnings } from '../../../../../DetailsView/components/banner-warnings';
import { DetailsListIssuesView } from '../../../../../DetailsView/components/details-list-issues-view';
import { TargetChangeDialog } from '../../../../../DetailsView/components/target-change-dialog';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../DetailsView/components/banner-warnings');
jest.mock('../../../../../DetailsView/components/target-change-dialog');
jest.mock('../../../../../DetailsView/components/details-list-issues-view');

describe('AssessmentIssuesTestView', () => {
    mockReactComponents([BannerWarnings, TargetChangeDialog, DetailsListIssuesView]);
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let getTestStatusMock: IMock<(data: ScanData, step?: string) => boolean>;
    let getAssessmentDataMock: IMock<(data: AssessmentStoreData) => AssessmentData>;
    let configurationStub: VisualizationConfiguration;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let updateHandlerMock: IMock<AssessmentViewUpdateHandler>;
    let propsStub: AssessmentIssuesTestViewProps;
    let assessmentProviderMock: IMock<AssessmentsProvider>;
    let depsStub;
    let assessmentStoreDataStub;

    const selectedTest: VisualizationType | number = -1;
    const warningConfigurationStub: WarningConfiguration = {} as WarningConfiguration;
    const switcherNavConfigurationStub: DetailsViewSwitcherNavConfiguration = {
        warningConfiguration: warningConfigurationStub,
    } as DetailsViewSwitcherNavConfiguration;
    const testsStub = {} as TestsEnabledState;
    const scanDataStub = {} as ScanData;
    const visualizationStoreDataStub = {
        tests: testsStub,
        scanning: 'test-scanning',
    } as VisualizationStoreData;
    const displayableDataStub = {
        title: 'test title',
    } as DisplayableVisualizationTypeData;
    const selectedTestViewStub = 'test-subview';
    const selectedTestTypeStub: number = -1;
    const persistedTabInfoStub = {} as PersistedTabInfo;
    const selectedRequirementIsEnabledStub = true;
    const assessmentDataStub = {} as AssessmentData;
    const requirementKeyStub = 'requirement-1';
    const assessmentStub = { requirements: [{ key: requirementKeyStub }] } as Assessment;
    const tabStoreDataStub = { id: 0, url: 'test-url', title: 'test-title' } as TabStoreData;

    beforeEach(() => {
        assessmentStoreDataStub = {
            assessmentNavState: {
                selectedTestSubview: selectedTestViewStub,
                selectedTestType: selectedTestTypeStub,
            },
            persistedTabInfo: persistedTabInfoStub,
        } as unknown as AssessmentStoreData;

        getStoreDataMock = Mock.ofInstance<(data: TestsEnabledState) => ScanData>(
            (_data: TestsEnabledState) => {
                return {} as ScanData;
            },
            MockBehavior.Strict,
        );
        getStoreDataMock
            .setup(m => m(testsStub))
            .returns(() => scanDataStub)
            .verifiable(Times.once());
        getTestStatusMock = Mock.ofInstance<(data: ScanData, step?: string) => boolean>(
            (_data: ScanData, _step?: string) => true,
            MockBehavior.Strict,
        );
        getTestStatusMock
            .setup(m => m(scanDataStub, selectedTestViewStub))
            .returns(() => selectedRequirementIsEnabledStub)
            .verifiable(Times.once());
        getAssessmentDataMock = Mock.ofInstance<(data: AssessmentStoreData) => AssessmentData>(
            (_data: AssessmentStoreData) => {
                return {} as AssessmentData;
            },
            MockBehavior.Strict,
        );
        getAssessmentDataMock
            .setup(m => m(assessmentStoreDataStub))
            .returns(() => assessmentDataStub)
            .verifiable(Times.once());

        configurationStub = {
            getStoreData: getStoreDataMock.object,
            getTestStatus: getTestStatusMock.object,
            getAssessmentData: getAssessmentDataMock.object,
            displayableData: displayableDataStub,
        } as VisualizationConfiguration;

        clickHandlerFactoryMock = Mock.ofType(DetailsViewToggleClickHandlerFactory);
        updateHandlerMock = Mock.ofType(AssessmentViewUpdateHandler, MockBehavior.Strict);
        assessmentProviderMock = Mock.ofType(AssessmentsProviderImpl, MockBehavior.Strict);
        updateHandlerMock = Mock.ofType(AssessmentViewUpdateHandler);
        assessmentProviderMock = Mock.ofType(AssessmentsProviderImpl);
        assessmentProviderMock
            .setup(m => m.forType(selectedTestTypeStub))
            .returns(() => assessmentStub)
            .verifiable(Times.once());

        depsStub = {
            assessmentViewUpdateHandler: updateHandlerMock.object,
            getProvider: () => assessmentProviderMock.object,
        };

        propsStub = {
            configuration: configurationStub,
            clickHandlerFactory: clickHandlerFactoryMock.object,
            visualizationStoreData: visualizationStoreDataStub,
            selectedTest: selectedTest,
            scanIncompleteWarnings: [],
            instancesSection: NamedFC<CommonInstancesSectionProps>('test', _ => null),
            switcherNavConfiguration: switcherNavConfigurationStub,
            assessmentStoreData: assessmentStoreDataStub,
            tabStoreData: tabStoreDataStub,
            deps: depsStub,
        } as AssessmentIssuesTestViewProps;
    });

    afterEach(() => {
        getStoreDataMock.verifyAll();
        getTestStatusMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
        updateHandlerMock.verifyAll();
        getAssessmentDataMock.verifyAll();
        assessmentProviderMock.verifyAll();
    });

    it('renders', () => {
        updateHandlerMock.setup(u => u.onMount(getUpdateHandlerProps())).verifiable(Times.once());

        const renderResult = render(<AssessmentIssuesTestView {...propsStub} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([
            BannerWarnings,
            TargetChangeDialog,
            DetailsListIssuesView,
        ]);
    });

    test('componentDidMount', () => {
        updateHandlerMock.setup(u => u.onMount(getUpdateHandlerProps())).verifiable(Times.once());

        const testObject = new AssessmentIssuesTestView(propsStub);

        testObject.componentDidMount();
    });

    test('componentWillUnmount', () => {
        updateHandlerMock.setup(u => u.onUnmount(getUpdateHandlerProps())).verifiable(Times.once());

        const testObject = new AssessmentIssuesTestView(propsStub);
        testObject.componentWillUnmount();
    });

    describe('componentDidUpdate', () => {
        let newTabStoreDataStub: TabStoreData;
        let newAssessmentStoreDataStub: AssessmentStoreData;
        let newProps: AssessmentIssuesTestViewProps;

        beforeEach(() => {
            newTabStoreDataStub = {
                id: 1,
                url: 'test-url-updated',
                title: 'test-title-updated',
            } as TabStoreData;
            newAssessmentStoreDataStub = {
                assessmentNavState: {
                    selectedTestSubview: selectedTestViewStub,
                    selectedTestType: selectedTestTypeStub,
                },
                persistedTabInfo: newTabStoreDataStub,
            } as unknown as AssessmentStoreData;
            newProps = {
                configuration: configurationStub,
                clickHandlerFactory: clickHandlerFactoryMock.object,
                visualizationStoreData: visualizationStoreDataStub,
                selectedTest: selectedTest,
                scanIncompleteWarnings: [],
                instancesSection: NamedFC<CommonInstancesSectionProps>('test', _ => null),
                switcherNavConfiguration: switcherNavConfigurationStub,
                assessmentStoreData: newAssessmentStoreDataStub,
                tabStoreData: tabStoreDataStub,
                deps: depsStub,
            } as AssessmentIssuesTestViewProps;
        });

        test('calls update', () => {
            const prevProps = propsStub;
            getStoreDataMock.reset();
            getStoreDataMock
                .setup(m => m(testsStub))
                .returns(() => scanDataStub)
                .verifiable(Times.exactly(2));
            getTestStatusMock.reset();
            getTestStatusMock
                .setup(m => m(scanDataStub, selectedTestViewStub))
                .returns(() => selectedRequirementIsEnabledStub)
                .verifiable(Times.exactly(2));
            getAssessmentDataMock.reset();
            getAssessmentDataMock
                .setup(m => m(assessmentStoreDataStub))
                .returns(() => assessmentDataStub)
                .verifiable(Times.once());
            getAssessmentDataMock
                .setup(m => m(newAssessmentStoreDataStub))
                .returns(() => assessmentDataStub)
                .verifiable(Times.once());
            assessmentProviderMock.reset();
            assessmentProviderMock
                .setup(m => m.forType(selectedTestTypeStub))
                .returns(() => assessmentStub)
                .verifiable(Times.exactly(2));

            const oldHandlerProps = getUpdateHandlerProps();
            const newHandlerProps = cloneDeep(oldHandlerProps);
            newHandlerProps.prevTarget = newTabStoreDataStub;
            updateHandlerMock
                .setup(u => u.update(newHandlerProps, oldHandlerProps))
                .verifiable(Times.once());

            const testObject = new AssessmentIssuesTestView(prevProps);

            testObject.componentDidUpdate(newProps);
        });

        test('does not call update when prevProps match new props', () => {
            const prevProps = propsStub;
            getStoreDataMock.reset();
            getStoreDataMock
                .setup(m => m(testsStub))
                .returns(() => scanDataStub)
                .verifiable(Times.exactly(2));
            getTestStatusMock.reset();
            getTestStatusMock
                .setup(m => m(scanDataStub, selectedTestViewStub))
                .returns(() => selectedRequirementIsEnabledStub)
                .verifiable(Times.exactly(2));
            getAssessmentDataMock.reset();
            getAssessmentDataMock
                .setup(m => m(assessmentStoreDataStub))
                .returns(() => assessmentDataStub)
                .verifiable(Times.exactly(2));
            assessmentProviderMock.reset();
            assessmentProviderMock
                .setup(m => m.forType(selectedTestTypeStub))
                .returns(() => assessmentStub)
                .verifiable(Times.exactly(2));

            const oldHandlerProps = getUpdateHandlerProps();
            const newHandlerProps = cloneDeep(oldHandlerProps);
            newHandlerProps.prevTarget = newTabStoreDataStub;
            updateHandlerMock
                .setup(u => u.update(It.isAny(), It.isAny()))
                .verifiable(Times.never());

            const testObject = new AssessmentIssuesTestView(prevProps);

            testObject.componentDidUpdate(prevProps);
        });

        test('calls update with undefined prevProps.selectedTestSubview when assessment is not found', () => {
            const prevProps = propsStub;
            getStoreDataMock.reset();
            getStoreDataMock
                .setup(m => m(testsStub))
                .returns(() => scanDataStub)
                .verifiable(Times.exactly(2));
            getTestStatusMock.reset();
            getTestStatusMock
                .setup(m => m(scanDataStub, selectedTestViewStub))
                .returns(() => selectedRequirementIsEnabledStub)
                .verifiable(Times.exactly(2));
            getAssessmentDataMock.reset();
            getAssessmentDataMock
                .setup(m => m(assessmentStoreDataStub))
                .returns(() => assessmentDataStub)
                .verifiable(Times.once());
            getAssessmentDataMock
                .setup(m => m(newAssessmentStoreDataStub))
                .returns(() => assessmentDataStub)
                .verifiable(Times.once());
            assessmentProviderMock.reset();
            assessmentProviderMock
                .setup(m => m.forType(selectedTestTypeStub))
                .returns(() => null)
                .verifiable(Times.exactly(2));

            const oldHandlerProps = getUpdateHandlerProps();
            oldHandlerProps.assessmentNavState.selectedTestSubview = undefined;
            const newHandlerProps = cloneDeep(oldHandlerProps);
            newHandlerProps.prevTarget = newTabStoreDataStub;
            updateHandlerMock
                .setup(u => u.update(newHandlerProps, oldHandlerProps))
                .verifiable(Times.once());

            const testObject = new AssessmentIssuesTestView(prevProps);

            testObject.componentDidUpdate(newProps);
        });
    });

    function getUpdateHandlerProps(): AssessmentViewUpdateHandlerProps {
        return {
            deps: depsStub,
            selectedRequirementIsEnabled: selectedRequirementIsEnabledStub,
            assessmentNavState: {
                selectedTestSubview: requirementKeyStub,
                selectedTestType: selectedTestTypeStub,
            },
            assessmentData: assessmentDataStub,
            prevTarget: persistedTabInfoStub,
            currentTarget: tabStoreDataStub,
        };
    }
});
