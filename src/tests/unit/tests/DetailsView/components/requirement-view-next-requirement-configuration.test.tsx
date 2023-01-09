// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AutomatedChecks } from 'assessments/automated-checks/assessment';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentNavState } from 'common/types/store-data/assessment-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { AssessmentViewUpdateHandler } from 'DetailsView/components/assessment-view-update-handler';
import {
    GetNextRequirementConfigurationDeps,
    GetNextRequirementConfigurationProps,
    NextRequirementButtonConfiguration,
    getNextRequirementConfigurationForAssessment,
    getNextRequirementConfigurationForQuickAssess,
} from 'DetailsView/components/requirement-view-next-requirement-configuration';
import { IMock, Mock } from 'typemoq';

describe('RequirementViewNextRequirementConfiguration', () => {
    let assessmentStub: Assessment;
    let requirementStub: Requirement;
    let otherRequirementStub: Requirement;
    let nextQuickAssessRequirementStub: Requirement;
    let otherAssessmentStub: Assessment;
    let assessmentNavState: AssessmentNavState;
    let quickAssessNavState: AssessmentNavState;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let quickAssessProviderMock: IMock<AssessmentsProvider>;
    let props: GetNextRequirementConfigurationProps;
    let updateHandlerMock: IMock<AssessmentViewUpdateHandler>;
    let mediumPassRequirementKeysStub: string[];
    let messageCreatorMock: IMock<AssessmentActionMessageCreator>;

    let deps: GetNextRequirementConfigurationDeps;
    let testSubject: NextRequirementButtonConfiguration;

    beforeEach(() => {
        mediumPassRequirementKeysStub = [
            'test-requirement-key',
            'next-quick-assess-requirement-key',
        ];
        requirementStub = {
            key: 'test-requirement-key',
            name: 'test-requirement-name',
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
            visualizationType: VisualizationType.LinksMediumPass,
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

        updateHandlerMock = Mock.ofType(AssessmentViewUpdateHandler);
        messageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);

        deps = {
            assessmentViewUpdateHandler: updateHandlerMock.object,
            getProvider: () => assessmentsProviderMock.object,
            mediumPassRequirementKeys: mediumPassRequirementKeysStub,
            getAssessmentActionMessageCreator: () => messageCreatorMock.object,
        } as GetNextRequirementConfigurationDeps;

        props = {
            deps: deps,
            assessmentNavState: assessmentNavState,
            currentRequirement: requirementStub,
            currentAssessment: assessmentStub,
        } as GetNextRequirementConfigurationProps;
    });

    describe('getNextRequirementConfigurationForAssessment', () => {
        it('returns nextRequirement and nextRequirementVisualizationType if one exists', () => {
            testSubject = getNextRequirementConfigurationForAssessment(props);

            expect(testSubject.nextRequirement).toBe(otherRequirementStub);
            expect(testSubject.nextRequirementVisualizationType).toBe(
                assessmentNavState.selectedTestType,
            );
        });

        it('returns null for nextRequirement and nextRequirementVisualizationType if none exist', () => {
            props.currentAssessment.requirements = [requirementStub];
            testSubject = getNextRequirementConfigurationForAssessment(props);
            expect(testSubject.nextRequirement).toBeNull();
            expect(testSubject.nextRequirementVisualizationType).toBe(
                assessmentNavState.selectedTestType,
            );
        });

        it('returns null for nextRequirement and nextRequirementVisualizationType if we are the last requirement', () => {
            props.currentAssessment.requirements = [otherRequirementStub, requirementStub];

            testSubject = getNextRequirementConfigurationForAssessment(props);
            expect(testSubject.nextRequirement).toBeNull();
            expect(testSubject.nextRequirementVisualizationType).toBe(
                assessmentNavState.selectedTestType,
            );
        });
    });

    describe('getNextRequirementConfigurationForQuickAssess', () => {
        beforeEach(() => {
            props.deps.mediumPassRequirementKeys = mediumPassRequirementKeysStub = [
                'test-requirement-key',
                'next-quick-assess-requirement-key',
            ];
            props.deps.getProvider = () => quickAssessProviderMock.object;
            props.assessmentNavState = quickAssessNavState;
        });

        it('returns nextRequirement and nextRequirementVisualizationType if one exists in mediumPassRequirementKeys', () => {
            testSubject = getNextRequirementConfigurationForQuickAssess(props);

            expect(testSubject.nextRequirement).toBe(nextQuickAssessRequirementStub);
            expect(testSubject.nextRequirementVisualizationType).toBe(
                otherAssessmentStub.visualizationType,
            );
        });

        it('passes the next Automated Checks requirement if we are in Automated Checks', () => {
            assessmentStub.key = AutomatedChecks.key;
            quickAssessProviderMock
                .setup(qap => qap.forType(quickAssessNavState.selectedTestType))
                .returns(() => assessmentStub);
            testSubject = getNextRequirementConfigurationForQuickAssess(props);
            expect(testSubject.nextRequirement).toBe(otherRequirementStub);
            expect(testSubject.nextRequirementVisualizationType).toBe(
                quickAssessNavState.selectedTestType,
            );
        });

        it('returns null for nextRequirement and nextRequirementVisualizationType if we are the last requirement', () => {
            props.deps.mediumPassRequirementKeys = ['test-requirement-key'];

            testSubject = getNextRequirementConfigurationForQuickAssess(props);
            expect(testSubject.nextRequirement).toBeNull();
            expect(testSubject.nextRequirementVisualizationType).toBe(
                quickAssessNavState.selectedTestType,
            );
        });
    });
});
