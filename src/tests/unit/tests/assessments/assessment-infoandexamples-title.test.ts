// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { Requirement } from 'assessments/types/requirement';

describe('assessment-infoandexamples-title', () => {
    test('all infoAndExamples have the correct pageTitle value', () => {
        Assessments.all().forEach(assessment => {
            assessment.requirements.forEach(assertInfoAndExamplesHasCorrectPageTitle);
        });
    });

    function infoAndExamplesHasCorrectPageTitle(requirement: Requirement): boolean {
        return (
            requirement.infoAndExamples === undefined || requirement.infoAndExamples.pageTitle === requirement.name
        );
    }

    function assertInfoAndExamplesHasCorrectPageTitle(requirement: Requirement): void {
        expect(infoAndExamplesHasCorrectPageTitle(requirement)).toBe(true);
    }
});
