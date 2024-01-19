// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import {
    AssessmentData,
    AssessmentNavState,
    GeneratedAssessmentInstance,
    RequirementIdToResultMap,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TestStepData } from 'common/types/store-data/manual-test-status';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentInstanceTable } from 'DetailsView/components/assessment-instance-table';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import {
    RequirementView,
    RequirementViewDeps,
    RequirementViewProps,
} from 'DetailsView/components/requirement-view';
import { RequirementViewComponentConfiguration } from 'DetailsView/components/requirement-view-component-configuration';
import {
    RequirementContextSectionFactory,
    RequirementContextSectionFactoryProps,
} from 'DetailsView/components/requirement-view-context-section-factory';
import { GetNextRequirementButtonConfiguration } from 'DetailsView/components/requirement-view-next-requirement-configuration';
import {
    RequirementViewTitleFactory,
    RequirementViewTitleFactoryProps,
} from 'DetailsView/components/requirement-view-title-factory';
import styles from 'DetailsView/components/requirement-view.scss';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { ContentPage, ContentPageComponent } from 'views/content/content-page';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';

jest.mock('DetailsView/components/assessment-instance-table');

describe('RequirementViewTest', () => {
    mockReactComponents([AssessmentInstanceTable]);
    let assessmentStub: Assessment;
    let requirementStub: Requirement;
    let otherRequirementStub: Requirement;
    let assessmentNavState: AssessmentNavState;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let props: RequirementViewProps;
    let assessmentDataStub: AssessmentData;
    let assessmentInstanceTableHandlerStub: AssessmentInstanceTableHandler;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;
    let updateHandlerMock: IMock<AssessmentViewUpdateHandler>;
    let requirementViewComponentConfigurationStub: RequirementViewComponentConfiguration;
    let getNextRequirementButtonConfigurationMock: IMock<GetNextRequirementButtonConfiguration>;
    let getRequirementViewTitleMock: IMock<RequirementViewTitleFactory>;
    let getRequirementContextSectionMock: IMock<RequirementContextSectionFactory>;
    let deps: RequirementViewDeps;
    let requirementContextSectionProps: RequirementContextSectionFactoryProps;
    let requirementViewTitleProps: RequirementViewTitleFactoryProps;
    beforeEach(() => {
        requirementStub = {
            key: 'test-requirement-key',
            name: 'rest-requirement-name',
            whyItMatters: ContentPage.create(() => 'WHY IT MATTERS' as any),
            guidanceLinks: [{ href: 'test-guidance-href', text: 'test-guidance-text' }],
            infoAndExamples: { pageTitle: 'test-page-title' } as ContentPageComponent,
            helpfulResourceLinks: [{ href: 'test-resource-href', text: 'test-resource-text' }],
        } as Requirement;
        otherRequirementStub = {
            key: 'other-requirement-key',
        } as Requirement;
        assessmentStub = {
            requirements: [requirementStub, otherRequirementStub],
            key: 'test-assessment',
        } as Assessment;
        assessmentNavState = {
            selectedTestType: VisualizationType.Headings,
            selectedTestSubview: 'test-requirement-name',
        };
        assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);
        assessmentsProviderMock
            .setup(ap => ap.forType(assessmentNavState.selectedTestType))
            .returns(() => assessmentStub);
        assessmentsProviderMock
            .setup(ap =>
                ap.getStep(
                    assessmentNavState.selectedTestType,
                    assessmentNavState.selectedTestSubview,
                ),
            )
            .returns(() => requirementStub);
        assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;

        getNextRequirementButtonConfigurationMock =
            Mock.ofType<GetNextRequirementButtonConfiguration>();

        assessmentDataStub = {
            generatedAssessmentInstancesMap: {} as DictionaryStringTo<GeneratedAssessmentInstance>,
            manualTestStepResultMap: {
                'some manual test step result id': null,
            } as RequirementIdToResultMap,
            testStepStatus: {
                [requirementStub.key]: { isStepScanned: true } as TestStepData,
            },
        } as AssessmentData;

        featureFlagStoreDataStub = {
            'some feature flag': true,
        };
        pathSnippetStoreDataStub = {
            path: null,
        } as PathSnippetStoreData;
        updateHandlerMock = Mock.ofType(AssessmentViewUpdateHandler);
        deps = {
            assessmentViewUpdateHandler: updateHandlerMock.object,
            getProvider: () => assessmentsProviderMock.object,
        } as RequirementViewDeps;

        getNextRequirementButtonConfigurationMock =
            Mock.ofType<GetNextRequirementButtonConfiguration>();

        requirementViewTitleProps = {
            assessmentKey: assessmentStub.key,
            name: requirementStub.name,
            guidanceLinks: requirementStub.guidanceLinks,
            infoAndExamples: requirementStub.infoAndExamples,
        } as RequirementViewTitleFactoryProps;
        getRequirementViewTitleMock = Mock.ofType<RequirementViewTitleFactory>();

        getRequirementViewTitleMock
            .setup(g => g(It.isObjectWith(requirementViewTitleProps)))
            .returns(() => <div>TITLE MOCK ELEMENT</div>)
            .verifiable();

        requirementContextSectionProps = {
            assessmentKey: assessmentStub.key,
            infoAndExamples: requirementStub.infoAndExamples,
            whyItMatters: requirementStub.whyItMatters,
            helpfulResourceLinks: requirementStub.helpfulResourceLinks,
        } as RequirementContextSectionFactoryProps;

        getRequirementContextSectionMock = Mock.ofType<RequirementContextSectionFactory>();

        getRequirementContextSectionMock
            .setup(g => g(It.isObjectWith(requirementContextSectionProps)))
            .returns(() => <div>REQUIREMENT CONTEXT SECTION MOCK ELEMENT</div>)
            .verifiable();

        getNextRequirementButtonConfigurationMock
            .setup(g =>
                g({
                    deps: deps,
                    currentAssessment: assessmentStub,
                    currentRequirement: requirementStub,
                    assessmentNavState,
                    className: styles.nextRequirementButton,
                }),
            )
            .returns(() => {
                return <>next requirement stub</>;
            })
            .verifiable();

        requirementViewComponentConfigurationStub = {
            getNextRequirementButton: getNextRequirementButtonConfigurationMock.object,
            getRequirementViewTitle: getRequirementViewTitleMock.object,
            getRequirementContextSection: getRequirementContextSectionMock.object,
        } as RequirementViewComponentConfiguration;

        props = {
            deps: deps,
            assessmentNavState: assessmentNavState,
            isRequirementEnabled: true,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
            prevTarget: { id: 4 },
            currentTarget: { id: 5 },
            assessmentData: assessmentDataStub,
            requirementViewComponentConfiguration: requirementViewComponentConfigurationStub,
        } as RequirementViewProps;
    });

    it('renders with content from props', () => {
        const renderResult = render(<RequirementView {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        getRequirementViewTitleMock.verifyAll();
        getRequirementContextSectionMock.verifyAll();
        getNextRequirementButtonConfigurationMock.verifyAll();
    });

    test('componentDidUpdate', () => {
        const newProps = cloneDeep(props);
        newProps.deps.assessmentViewUpdateHandler = updateHandlerMock.object;
        const prevProps = props;
        prevProps.assessmentNavState.selectedTestSubview = 'prevTestStep';

        updateHandlerMock
            .setup(u =>
                u.update(
                    It.isValue(getUpdateHandlerProps(prevProps)),
                    It.isValue(getUpdateHandlerProps(newProps)),
                ),
            )
            .verifiable(Times.once());

        const testObject = new RequirementView(newProps);

        testObject.componentDidUpdate(prevProps);

        updateHandlerMock.verifyAll();
    });

    test('componentDidMount', () => {
        updateHandlerMock
            .setup(u => u.onMount(getUpdateHandlerProps(props)))
            .verifiable(Times.once());

        const testObject = new RequirementView(props);

        testObject.componentDidMount();

        updateHandlerMock.verifyAll();
    });

    test('componentWillUnmount', () => {
        updateHandlerMock
            .setup(u => u.onUnmount(getUpdateHandlerProps(props)))
            .verifiable(Times.once());

        const testObject = new RequirementView(props);

        testObject.componentWillUnmount();

        updateHandlerMock.verifyAll();
    });

    function getUpdateHandlerProps(
        givenProps: RequirementViewProps,
    ): AssessmentViewUpdateHandlerProps {
        return {
            deps: givenProps.deps,
            selectedRequirementIsEnabled: givenProps.isRequirementEnabled,
            assessmentNavState: givenProps.assessmentNavState,
            assessmentData: givenProps.assessmentData,
            prevTarget: givenProps.prevTarget,
            currentTarget: givenProps.currentTarget,
        };
    }
});
