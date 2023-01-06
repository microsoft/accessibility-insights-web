// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement, VisualHelperToggleConfig } from 'assessments/types/requirement';
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
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { NextRequirementButton } from 'DetailsView/components/next-requirement-button';
import {
    RequirementView,
    RequirementViewDeps,
    RequirementViewProps,
} from 'DetailsView/components/requirement-view';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('RequirementViewTest', () => {
    let assessmentStub: Assessment;
    let requirementStub: Requirement;
    let otherRequirementStub: Requirement;
    let nextQuickAssessRequirementStub: Requirement;
    let otherAssessmentStub: Assessment;
    let assessmentNavState: AssessmentNavState;
    let quickAssessNavState: AssessmentNavState;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let quickAssessProviderMock: IMock<AssessmentsProvider>;
    let props: RequirementViewProps;
    let assessmentDataStub: AssessmentData;
    let assessmentInstanceTableHandlerStub: AssessmentInstanceTableHandler;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;
    let updateHandlerMock: IMock<AssessmentViewUpdateHandler>;
    let mediumPassRequirementKeysStub: string[];

    beforeEach(() => {
        mediumPassRequirementKeysStub = [
            'test-requirement-key',
            'next-quick-assess-requirement-key',
        ];
        requirementStub = {
            key: 'test-requirement-key',
            name: 'test-requirement-name',
            description: <div>test-description</div>,
            howToTest: <p>how-to-test-stub</p>,
            getVisualHelperToggle: (props: VisualHelperToggleConfig) => (
                <div>test-visual-helper-toggle</div>
            ),
        } as Requirement;
        otherRequirementStub = {
            key: 'other-requirement-key',
        } as Requirement;
        nextQuickAssessRequirementStub = {
            key: 'next-quick-assess-requirement-key',
        } as Requirement;
        assessmentStub = {
            requirements: [requirementStub, otherRequirementStub],
            key: 'test-assessment',
        } as Assessment;
        otherAssessmentStub = {
            requirements: [nextQuickAssessRequirementStub],
            key: 'other-assessment',
        } as Assessment;
        assessmentNavState = {
            selectedTestType: VisualizationType.Headings,
            selectedTestSubview: 'test-requirement-name',
        };
        quickAssessNavState = {
            selectedTestType: VisualizationType.HeadingsMediumPass,
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
        quickAssessProviderMock = Mock.ofType(AssessmentsProviderImpl);
        quickAssessProviderMock
            .setup(qap => qap.forType(quickAssessNavState.selectedTestType))
            .returns(() => assessmentStub);
        quickAssessProviderMock
            .setup(qap =>
                qap.getStep(
                    quickAssessNavState.selectedTestType,
                    quickAssessNavState.selectedTestSubview,
                ),
            )
            .returns(() => requirementStub);
        quickAssessProviderMock
            .setup(qap => qap.forRequirementKey('next-quick-assess-requirement-key'))
            .returns(() => otherAssessmentStub);
        assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;

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

        props = {
            deps: {
                assessmentViewUpdateHandler: updateHandlerMock.object,
                getProvider: () => assessmentsProviderMock.object,
                mediumPassRequirementKeys: mediumPassRequirementKeysStub,
            } as RequirementViewDeps,
            assessmentNavState: assessmentNavState,
            isRequirementEnabled: true,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
            prevTarget: { id: 4 },
            currentTarget: { id: 5 },
            assessmentData: assessmentDataStub,
        } as RequirementViewProps;
    });

    it('renders with content from props', () => {
        const rendered = shallow(<RequirementView {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    describe('nextRequirement handling', () => {
        describe('when shouldShowQuickAssessRequirementView is true', () => {
            beforeEach(() => {
                props.deps.mediumPassRequirementKeys = mediumPassRequirementKeysStub = [
                    'test-requirement-key',
                    'next-quick-assess-requirement-key',
                ];
                props.deps.getProvider = () => quickAssessProviderMock.object;
                props.assessmentNavState = quickAssessNavState;
                props.shouldShowQuickAssessRequirementView = true;
            });

            it('passes along nextRequirement from mediumPassRequirementKeys if one exists', () => {
                const rendered = shallow(<RequirementView {...props} />);
                expect(rendered.find(NextRequirementButton).prop('nextRequirement')).toBe(
                    nextQuickAssessRequirementStub,
                );
            });

            it('passes the next Automated Checks requirement if we are in Automated Checks', () => {
                assessmentStub.key = AutomatedChecks.key;
                quickAssessProviderMock
                    .setup(qap => qap.forType(quickAssessNavState.selectedTestType))
                    .returns(() => assessmentStub);
                const rendered = shallow(<RequirementView {...props} />);

                expect(rendered.find(NextRequirementButton).prop('nextRequirement')).toBe(
                    otherRequirementStub,
                );
            });

            it('passes a null nextRequirement if we are the last requirement', () => {
                props.deps.mediumPassRequirementKeys = ['test-requirement-key'];

                const rendered = shallow(<RequirementView {...props} />);
                expect(rendered.find(NextRequirementButton).prop('nextRequirement')).toBeNull();
            });
        });

        describe('when shouldShowQuickAssessRequirementView is false', () => {
            it('passes along nextRequirement if one exists', () => {
                assessmentStub.requirements = [requirementStub, otherRequirementStub];

                const rendered = shallow(
                    <RequirementView shouldShowQuickAssessRequirementView={false} {...props} />,
                );
                expect(rendered.find(NextRequirementButton).prop('nextRequirement')).toBe(
                    otherRequirementStub,
                );
            });

            it('passes a null nextRequirement if none exist', () => {
                assessmentStub.requirements = [requirementStub];

                const rendered = shallow(
                    <RequirementView shouldShowQuickAssessRequirementView={false} {...props} />,
                );
                expect(rendered.find(NextRequirementButton).prop('nextRequirement')).toBeNull();
            });

            it('passes a null nextRequirement if we are the last requirement', () => {
                assessmentStub.requirements = [otherRequirementStub, requirementStub];

                const rendered = shallow(
                    <RequirementView shouldShowQuickAssessRequirementView={false} {...props} />,
                );
                expect(rendered.find(NextRequirementButton).prop('nextRequirement')).toBeNull();
            });
        });
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
