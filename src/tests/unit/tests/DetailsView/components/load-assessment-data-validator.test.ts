// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ValidateFunction } from 'ajv';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { AssessmentData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';
import { IMock, Mock, Times } from 'typemoq';

describe(LoadAssessmentDataValidator, () => {
    let testSubject: LoadAssessmentDataValidator;
    const featureFlagStoreDataStub = {} as FeatureFlagStoreData;
    let assessmentsStub;
    let validJson: VersionedAssessmentData;
    let invalidJson: any;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let getFilterProviderMock: IMock<
        (
            assessmentProvider: AssessmentsProvider,
            flags: FeatureFlagStoreData,
        ) => AssessmentsProvider
    >;
    let validateFunctionMock: IMock<ValidateFunction>;

    beforeEach(() => {
        validJson = {
            assessmentData: {
                persistedTabInfo: {},
                assessmentNavState: {},
                assessments: {},
                resultDescription: '',
            },
            version: 1,
        } as VersionedAssessmentData;
        invalidJson = { invalid: 'json' };
        assessmentsStub = [] as readonly Readonly<Assessment>[];

        assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);
        assessmentsProviderMock
            .setup(apm => apm.all())
            .returns(() => {
                return assessmentsStub;
            })
            .verifiable(Times.once());

        getFilterProviderMock =
            Mock.ofType<
                (
                    assessmentProvider: AssessmentsProvider,
                    flags: FeatureFlagStoreData,
                ) => AssessmentsProvider
            >();
        getFilterProviderMock
            .setup(m => m(assessmentsProviderMock.object, featureFlagStoreDataStub))
            .returns(() => assessmentsProviderMock.object)
            .verifiable(Times.once());

        validateFunctionMock = Mock.ofType<ValidateFunction>();
    });

    afterEach(() => {
        assessmentsProviderMock.verifyAll();
        getFilterProviderMock.verifyAll();
        validateFunctionMock.verifyAll();
    });

    describe('Build Generated Validator', () => {
        beforeEach(() => {
            testSubject = new LoadAssessmentDataValidator(
                assessmentsProviderMock.object,
                featureFlagStoreDataStub,
                validateFunctionMock.object,
                getFilterProviderMock.object,
            );
        });

        it('passes validation with valid JSON', () => {
            validateFunctionMock
                .setup(m => m(validJson))
                .returns(() => true)
                .verifiable(Times.once());

            const validationResults = testSubject.uploadedDataIsValid(validJson);
            expect(validationResults.dataIsValid).toEqual(true);
        });

        it('does not pass validation with invalid JSON', () => {
            validateFunctionMock
                .setup(m => m(invalidJson))
                .returns(() => false)
                .verifiable(Times.once());

            const validationResults = testSubject.uploadedDataIsValid(invalidJson);
            expect(validationResults.dataIsValid).toEqual(false);
        });

        it('passes validation when an enabled flag assessment is added', () => {
            const assessments: { [key: string]: AssessmentData } = {
                flaggedAssessment: {} as AssessmentData,
            };
            const jsonWithFlaggedAssessment = {
                assessmentData: {
                    persistedTabInfo: {},
                    assessmentNavState: {},
                    assessments,
                    resultDescription: '',
                },
                version: 1,
            } as VersionedAssessmentData;
            assessmentsStub = [{ key: 'flaggedAssessment' } as Assessment];

            validateFunctionMock
                .setup(m => m(jsonWithFlaggedAssessment))
                .returns(() => true)
                .verifiable(Times.once());

            const validationResults = testSubject.uploadedDataIsValid(jsonWithFlaggedAssessment);
            expect(validationResults.dataIsValid).toEqual(true);
        });

        it('does not pass validation when disabled flag assessment is added', () => {
            const assessments: { [key: string]: AssessmentData } = {
                flaggedAssessment: {} as AssessmentData,
            };
            const jsonWithFlaggedAssessment = {
                assessmentData: {
                    persistedTabInfo: {},
                    assessmentNavState: {},
                    assessments,
                    resultDescription: '',
                },
                version: 1,
            } as VersionedAssessmentData;

            validateFunctionMock
                .setup(m => m(jsonWithFlaggedAssessment))
                .returns(() => true)
                .verifiable(Times.once());

            const validationResults = testSubject.uploadedDataIsValid(jsonWithFlaggedAssessment);
            expect(validationResults.dataIsValid).toEqual(false);
            expect(validationResults.errors).toEqual([
                {
                    message:
                        'Assessment data contains assessments that are behind disabled feature flags: flaggedAssessment',
                },
            ]);
        });
    });
});
