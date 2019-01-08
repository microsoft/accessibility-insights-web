// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock } from 'typemoq';

import { IAssessment } from '../../../../../assessments/types/iassessment';
import { IAssessmentsProvider } from '../../../../../assessments/types/iassessments-provider';
import { AssessmentTestProviderDeps, AssessmentTestResult } from '../../../../../common/assessment/assessment-test-result';
import { RequirementResult } from '../../../../../common/assessment/requirement';
import { IManualTestStatus, ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { IAssessmentData } from '../../../../../common/types/store-data/iassessment-result-data';

describe('AssessmentTestResult', () => {

    const type = -2112;
    const key = 'TheKey';
    const definition = { key, type } as IAssessment;
    const assessmentProvider = {
        forType: t => t === type && definition,
    } as IAssessmentsProvider;

    const testStepStatus = {
        alpha: { stepFinalResult: ManualTestStatus.PASS, isStepScanned: true },
        beta: { stepFinalResult: ManualTestStatus.FAIL, isStepScanned: true },
        gamma: { stepFinalResult: ManualTestStatus.PASS, isStepScanned: false },
    } as IManualTestStatus;
    const assessmentData = { testStepStatus } as IAssessmentData;

    const requirementsResults = [
        {
            data: { stepFinalResult: ManualTestStatus.PASS, isStepScanned: true },
            definition: { key: 'alpha' },
        },
        {
            data: { stepFinalResult: ManualTestStatus.FAIL, isStepScanned: true },
            definition: { key: 'beta' },
        },
        {
            data: { stepFinalResult: ManualTestStatus.UNKNOWN, isStepScanned: true },
            definition: { key: 'gamma' },
        },
    ] as RequirementResult[];

    const outcomeStats = { pass: 1, fail: 2, incomplete: 3 };

    const depsMock = Mock.ofType<AssessmentTestProviderDeps>();
    depsMock.setup(d => d.getRequirementsResults(assessmentProvider, type, testStepStatus)).returns(() => requirementsResults);
    depsMock.setup(d => d.outcomeStatsFromManualTestStatus(testStepStatus)).returns(() => outcomeStats);

    const testObject = new AssessmentTestResult(assessmentProvider, type, assessmentData, depsMock.object);

    it('provides definition', () => {

        expect(testObject.definition.key).toEqual(key);

    });

    it('provides data', () => {

        expect(testObject.data).toEqual(assessmentData);

    });

    it('provides RequirementResult', () => {

        expect(testObject.getRequirementResult('beta')).toEqual(requirementsResults[1]);

    });

    it('provides requirementResults', () => {

        expect(testObject.getRequirementResults()).toEqual(requirementsResults);

    });

    it('provides type', () => {

        expect(testObject.type).toEqual(type);

    });

    it('provides outcomeStats', () => {

        expect(testObject.getOutcomeStats()).toEqual(outcomeStats);

    });

});
