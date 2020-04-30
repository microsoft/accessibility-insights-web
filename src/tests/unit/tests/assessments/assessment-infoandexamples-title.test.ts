// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from 'assessments/assessments';
import { Requirement } from 'assessments/types/requirement';

describe('assessment-infoandexamples-title', () => {
    test('all infoAndExamples have a pageTitle value', () => {
        Assessments.all().forEach(assessment => {
            assessment.requirements.forEach(assertInfoAndExamplesHasPageTitle);
        });
    });

    function infoAndExamplesHasPageTitle(requirement: Requirement): boolean {
        return (
            requirement.infoAndExamples === undefined ||
            requirement.infoAndExamples.pageTitle !== undefined
        );
    }

    function assertInfoAndExamplesHasPageTitle(requirement: Requirement): void {
        expect(infoAndExamplesHasPageTitle(requirement)).toBe(true);
    }
});
