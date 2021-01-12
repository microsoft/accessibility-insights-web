// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    AssessmentDefaultMessageGenerator,
    DefaultMessageInterface,
    IGetMessageGenerator,
    IMessageGenerator,
} from 'assessments/assessment-default-message-generator';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { forOwn } from 'lodash';
import { AssessmentReportModelBuilder } from 'reports/assessment-report-model-builder';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { AssessmentStoreData } from '../../../../common/types/store-data/assessment-result-data';
import { AssessmentReportBuilderTestHelper } from './assessment-report-builder-test-helper';

describe('AssessmentReportModelBuilderTest', () => {
    const assessmentsProviderMock = Mock.ofType<AssessmentsProvider>(AssessmentsProviderImpl);
    const getDefaultMessageStub: IGetMessageGenerator = generator => (map, step) => null;
    const getDefaultMessageMock = Mock.ofInstance(getDefaultMessageStub);
    const assessments = AssessmentReportBuilderTestHelper.getAssessmentProviderAll(
        getDefaultMessageMock.object,
    );
    const assessmentDefaultMessageGeneratorMock = Mock.ofType<AssessmentDefaultMessageGenerator>(
        AssessmentDefaultMessageGenerator,
        MockBehavior.Strict,
    );
    const assessmentStoreData = AssessmentReportBuilderTestHelper.getAssessmentStoreData();
    const generatorStub: IMessageGenerator = (instances, step) => null;
    const generatorMock = Mock.ofInstance(generatorStub, MockBehavior.Strict);
    const expectedMessage: DefaultMessageInterface = {} as DefaultMessageInterface;

    setupGeneratorMockWithAssessmentData(
        generatorMock,
        getDefaultMessageMock,
        assessmentStoreData,
        assessments,
        expectedMessage,
        assessmentDefaultMessageGeneratorMock,
    );

    assessmentsProviderMock.setup(ap => ap.all()).returns(() => assessments);

    const targetAppInfo: TargetAppData = {
        url: 'url',
        name: 'title',
    };

    AssessmentReportBuilderTestHelper.setMessageComponent(expectedMessage);
    const expectedResult = AssessmentReportBuilderTestHelper.getAssessmentReportModel();

    function getBuilder(): AssessmentReportModelBuilder {
        return new AssessmentReportModelBuilder(
            assessmentsProviderMock.object,
            assessmentStoreData,
            targetAppInfo,
            AssessmentReportBuilderTestHelper.reportDate,
            assessmentDefaultMessageGeneratorMock.object,
        );
    }

    it('getReportModelData returns as expected', () => {
        const testObject = getBuilder();
        const actual = testObject.getReportModelData();

        expect(actual).toEqual(expectedResult);
        generatorMock.verifyAll();
        getDefaultMessageMock.verifyAll();
    });
});

function setupGeneratorMockWithAssessmentData(
    messageGenerator: IMock<IMessageGenerator>,
    getDefaultMessageMock: IMock<IGetMessageGenerator>,
    assessmentStoreData: AssessmentStoreData,
    assessments: Assessment[],
    stubMessage: DefaultMessageInterface,
    assessmentDefaultMessageGeneratorMock: IMock<AssessmentDefaultMessageGenerator>,
): void {
    forOwn(assessmentStoreData.assessments, (assessmentData, assessmentKey) => {
        AssessmentReportBuilderTestHelper.getStepKeysForAssessment(
            assessmentKey,
            assessments,
        ).forEach(stepKey => {
            getDefaultMessageMock
                .setup(gdm => gdm(assessmentDefaultMessageGeneratorMock.object))
                .returns(() => messageGenerator.object)
                .verifiable(Times.atLeastOnce());

            messageGenerator
                .setup(gm => gm(assessmentData.generatedAssessmentInstancesMap, stepKey))
                .returns(() => stubMessage)
                .verifiable();
        });
    });
}
