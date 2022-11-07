// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { VisualizationType } from 'common/types/visualization-type';
import { includes, keys } from 'lodash';

describe('AssessmentsProviderTest', () => {
    const firstType = 45 as VisualizationType;
    const secondType = 21 as VisualizationType;
    const invalidType = 99 as VisualizationType;
    const firstKey = 'forty-five';
    const secondKey = 'twenty-one';
    const invalidKey = 'ninety-nine';
    const stepOneKey = 'ONE';
    const stepTwoKey = 'TWO';
    const stepThreeKey = 'THREE';
    const invalidStepKey = 'INVALID';

    test('isValidType', () => {
        const provider = getProvider();

        expect(provider.isValidType(firstType)).toBeTruthy();
        expect(provider.isValidType(secondType)).toBeTruthy();
        expect(provider.isValidType(invalidType)).toBeFalsy();
    });

    test('forType exists', () => {
        const provider = getProvider();

        const firstAssessment = provider.forType(firstType);
        expect(firstAssessment.visualizationType).toEqual(firstType);

        const secondAssessment = provider.forType(secondType);
        expect(secondAssessment.visualizationType).toEqual(secondType);
    });

    test('forType does not exist', () => {
        const provider = getProvider();

        const invalidAssessment = provider.forType(invalidType);
        expect(invalidAssessment).not.toBeDefined();
    });

    test('isValidKey', () => {
        const provider = getProvider();

        expect(provider.isValidKey(firstKey)).toBeTruthy();
        expect(provider.isValidKey(secondKey)).toBeTruthy();
        expect(provider.isValidKey(invalidKey)).toBeFalsy();
    });

    test('forKey exists', () => {
        const provider = getProvider();

        const firstAssessment = provider.forKey(firstKey);
        expect(firstAssessment.visualizationType).toEqual(firstType);

        const secondAssessment = provider.forKey(secondKey);
        expect(secondAssessment.visualizationType).toEqual(secondType);
    });

    test('forKey does not exist', () => {
        const provider = getProvider();

        const invalidAssessment = provider.forKey(invalidKey);
        expect(invalidAssessment).not.toBeDefined();
    });

    test('forRequirementKey exists', () => {
        const provider = getProvider();

        const firstAssessment = provider.forRequirementKey(stepOneKey);
        expect(firstAssessment.visualizationType).toEqual(firstType);

        const secondAssessment = provider.forRequirementKey(stepThreeKey);
        expect(secondAssessment.visualizationType).toEqual(secondType);
    });

    test('forRequirementKey does not exist', () => {
        const provider = getProvider();

        const invalidAssessment = provider.forRequirementKey(invalidStepKey);
        expect(invalidAssessment).not.toBeDefined();
    });

    test('getStep', () => {
        const provider = getProvider();

        const stepOne = provider.getStep(firstType, stepOneKey);
        expect(stepOne.key).toEqual(stepOneKey);

        const stepTwo = provider.getStep(firstType, stepTwoKey);
        expect(stepTwo.key).toEqual(stepTwoKey);

        const invalidTest = provider.getStep(invalidType, stepOneKey);
        expect(invalidTest).toBeNull();

        const invalidStep = provider.getStep(firstType, invalidStepKey);
        expect(invalidStep).toBeNull();
    });

    test('all', () => {
        const provider = getProvider();

        const all = provider.all();
        expect(all.length).toBe(2);
        expect(all[0].visualizationType).toBe(firstType);
        expect(all[1].visualizationType).toBe(secondType);
    });

    test('all returns a clone', () => {
        const provider = getProvider();

        const initialCall = provider.all();
        const shouldBeClone = provider.all() as Array<Readonly<Assessment>>;
        shouldBeClone.pop();
        expect(initialCall.length).toBe(2);
        expect(shouldBeClone.length).toBe(1);
    });

    test('build assessment map', () => {
        const alpha = 'ALPHA';
        const beta = 'BETA';
        const gamma = 'GAMMA';
        const delta = 'DELTA';
        const assessments = [
            makeAssessment(firstType, [alpha, beta]),
            makeAssessment(secondType, [gamma, delta]),
        ];
        const provider = AssessmentsProviderImpl.Create(assessments);

        const firstSteps = provider.getStepMap(firstType);
        const secondSteps = provider.getStepMap(secondType);
        const invalidSteps = provider.getStepMap(invalidType);

        expect(keys(firstSteps).length).toBe(2);
        expect(includes(keys(firstSteps), alpha)).toBeTruthy();
        expect(includes(keys(firstSteps), beta)).toBeTruthy();

        expect(firstSteps[alpha].key).toBe(alpha);
        expect(firstSteps[beta].key).toBe(beta);

        expect(keys(secondSteps).length).toBe(2);
        expect(includes(keys(secondSteps), gamma)).toBeTruthy();
        expect(includes(keys(secondSteps), delta)).toBeTruthy();

        expect(secondSteps[gamma].key).toEqual(gamma);
        expect(secondSteps[delta].key).toEqual(delta);

        expect(invalidSteps).toBeNull();
    });

    function getProvider(): AssessmentsProvider {
        const assessments = [
            {
                visualizationType: firstType,
                key: firstKey,
                requirements: [{ key: stepOneKey }, { key: stepTwoKey }],
            } as Assessment,
            {
                visualizationType: secondType,
                key: secondKey,
                requirements: [{ key: stepThreeKey }],
            } as Assessment,
        ];
        const provider = AssessmentsProviderImpl.Create(assessments);
        return provider;
    }

    function makeAssessment(assessmentType: number, stepKeys: string[]): Assessment {
        return {
            visualizationType: assessmentType,
            requirements: stepKeys.map(makeStep),
        } as Assessment;
    }

    function makeStep(key: string): Requirement {
        return { key } as Requirement;
    }
});
