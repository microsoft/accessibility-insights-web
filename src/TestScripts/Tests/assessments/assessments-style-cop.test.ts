// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Assessments } from '../../../assessments/assessments';
import { IAssessment } from '../../../assessments/types/iassessment';
import { VisualizationType } from '../../../common/types/visualization-type';

describe('assessments-style-cop', () => {
    test('validate properly styled logic', () => {
        assertIsProperlyStyled('This is sentence case');
        assertIsProperlyStyled('This has a / slash');
        assertIsProperlyStyled('This has a hyphenated-word');
        assertIsProperlyStyled('ASDF');
        assertIsProperlyStyled('ASDFs');
        expect(isSentenceCase('This is Title Case')).toBe(false);
        expect(isUpperCaseAcronym('NOTREALLYCORRECTd')).toBe(false);
    });

    test('test and step names are properly styled', () => {
        Assessments.all().forEach(assessment => {
            assertIsProperlyStyled(assessment.title, assessment.key);
            if (assessment.type === VisualizationType.AutomatedChecks) {
                return;
            }

            assessment.steps.forEach(step => {
                assertIsProperlyStyled(step.name, assessment.key + '.' + step.key);
            });

        });
    });

    function isProperlyStyled(s: string) {
        return isUpperCaseAcronym(s) || isSentenceCase(s);
    }

    function isUpperCaseAcronym(s: string) {
        return /^[A-Z0-9\-]+s?$/.test(s);
    }

    function isSentenceCase(s: string) {
        return /^[A-Z][a-z0-9\-,/]*(\s[a-z0-9\-,/]+)*$/.test(s);
    }

    function assertIsProperlyStyled(s: string, where?: string) {
        expect(isProperlyStyled(s)).toBe(true);
    }

    test('findFirstDuplicateTestStepKey finds first duplicate as promised', () => {
        const assessmentWithNoDuplicates = [
            {
                steps: [
                    { key: 'A' },
                    { key: 'B' },
                ],
            },
            {
                steps: [
                    { key: 'C' },
                    { key: 'D' },
                ],
            },
        ];

        const assessmentWithOneDuplicate = [
            ...assessmentWithNoDuplicates,
            {
                steps: [
                    { key: 'E' },
                    { key: 'C' },
                ],
            },
        ];

        const assessmentWithTwoDuplicates = [
            ...assessmentWithNoDuplicates,
            {
                steps: [
                    { key: 'B' },
                    { key: 'C' },
                ],
            },
        ];

        expect(findFirstDuplicateTestStepKey(assessmentWithNoDuplicates as any)).toBeNull();
        expect(findFirstDuplicateTestStepKey(assessmentWithOneDuplicate as any)).toBe('C');
        expect(findFirstDuplicateTestStepKey(assessmentWithTwoDuplicates as any)).toBe('B');
    });

    test('test step key names are unique', () => {
        expect(findFirstDuplicateTestStepKey(Assessments.all())).toBeNull();
    });

    function findFirstDuplicateTestStepKey(all: ReadonlyArray<Readonly<IAssessment>>): string {
        const testStepKeys = {};
        let duplicateKey = null;

        all.forEach(test => {
            test.steps.forEach(step => {
                if (testStepKeys[step.key] && !duplicateKey) {
                    duplicateKey = step.key;
                }
                testStepKeys[step.key] = true;
            });
        });

        return duplicateKey;
    }
});
