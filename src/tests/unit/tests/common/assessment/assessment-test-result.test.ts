// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Mock } from 'typemoq';
import {
    AssessmentTestProviderDeps,
    AssessmentTestResult,
} from '../../../../../common/assessment/assessment-test-result';
import { RequirementResult } from '../../../../../common/assessment/requirement';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../../../common/types/manual-test-status';
import { AssessmentData } from '../../../../../common/types/store-data/assessment-result-data';

describe('AssessmentTestResult', () => {
    const assessmentType = -2112;
    const key = 'TheKey';
    const definition = { key, visualizationType: assessmentType } as Assessment;
    const assessmentProvider = {
        forType: t => t === assessmentType && definition,
    } as AssessmentsProvider;

    const testStepStatus = {
        alpha: { stepFinalResult: ManualTestStatus.PASS, isStepScanned: true },
        beta: { stepFinalResult: ManualTestStatus.FAIL, isStepScanned: true },
        gamma: { stepFinalResult: ManualTestStatus.PASS, isStepScanned: false },
    } as ManualTestStatusData;
    const assessmentData = { testStepStatus } as AssessmentData;

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
    depsMock
        .setup(d => d.getRequirementsResults(assessmentProvider, assessmentType, testStepStatus))
        .returns(() => requirementsResults);
    depsMock
        .setup(d => d.outcomeStatsFromManualTestStatus(testStepStatus))
        .returns(() => outcomeStats);

    const testObject = new AssessmentTestResult(
        assessmentProvider,
        assessmentType,
        assessmentData,
        depsMock.object,
    );

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
        expect(testObject.visualizationType).toEqual(assessmentType);
    });

    it('provides outcomeStats', () => {
        expect(testObject.getOutcomeStats()).toEqual(outcomeStats);
    });
});
