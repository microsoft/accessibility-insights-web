// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import Ajv from 'ajv';
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';
import { IMock, Mock } from 'typemoq';

describe('LoadAssessmentDataValidator', () => {
    let testSubject: LoadAssessmentDataValidator;
    let ajv: Ajv;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    const featureFlagStoreDataStub = {} as FeatureFlagStoreData;
    let validJson: VersionedAssessmentData;

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

        ajv = new Ajv();
        assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);

        assessmentsProviderMock
            .setup(apm => apm.all())
            .returns(() => {
                return [] as readonly Readonly<Assessment>[];
            });

        testSubject = new LoadAssessmentDataValidator(
            ajv,
            assessmentsProviderMock.object,
            featureFlagStoreDataStub,
        );
    });

    test('value is not null', () => {
        expect(testSubject).not.toBeNull();
    });

    it('passes validation with valid JSON', () => {
        const validationResults = testSubject.uploadedDataIsValid(validJson);
        expect(validationResults.dataIsValid).toEqual(true);
    });

    it("doesn't pass validation when an extra field is added", () => {
        validJson.assessmentData.persistedTabInfo['iAmHereToExploitYou'] = {};
        const validationResults = testSubject.uploadedDataIsValid(validJson);
        expect(validationResults.dataIsValid).toEqual(false);
    });

    it('passes back validation errors when validation fails', () => {
        validJson.assessmentData.persistedTabInfo['iAmStillHereToExploitYou'] = {};
        const validationResults = testSubject.uploadedDataIsValid(validJson);
        expect(validationResults.errors).not.toBeNull();
    });

    it('passes back errors as null when validation is successful', () => {
        const validationResults = testSubject.uploadedDataIsValid(validJson);
        expect(validationResults.errors).toBeNull();
    });
});
