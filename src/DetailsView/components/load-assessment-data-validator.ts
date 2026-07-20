// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ErrorObject, ValidateFunction } from 'ajv';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { deprecatedAssessmentKeys } from 'common/visualization-type-helper';
import validateAssessmentJson from './empty-validate-assessment-json';

export type AjvValidationReturnData = {
    dataIsValid: boolean;
    errors: ErrorObject[] | null;
};
export class LoadAssessmentDataValidator {
    constructor(
        private readonly assessmentsProvider: AssessmentsProvider,
        private readonly featureFlagStoreData: FeatureFlagStoreData,
        private readonly staticValidator: ValidateFunction = validateAssessmentJson,
        private readonly getFilterProvider: (
            assessmentProvider: AssessmentsProvider,
            flags: FeatureFlagStoreData,
        ) => AssessmentsProvider = assessmentsProviderWithFeaturesEnabled,
    ) {}

    public uploadedDataIsValid(
        parsedAssessmentData: VersionedAssessmentData,
    ): AjvValidationReturnData {
        const assessments = this.getAssessments();

        // We must generate the validation function on build - ajv would require the use of
        // an unsafe-eval CSP header to compile it at runtime, which Chromium disallows for
        // Manifest v3 extensions.
        let dataIsValid = this.staticValidator(parsedAssessmentData);
        let errors = this.staticValidator.errors;

        // We can't dynamically check which feature flags are set in our assessment validator,
        // so check it here instead.
        if (dataIsValid) {
            const unknownAssessments = Object.keys(
                parsedAssessmentData.assessmentData.assessments,
            ).filter(
                parsedKey =>
                    !assessments.some(knownAssessment => knownAssessment.key === parsedKey) &&
                    !deprecatedAssessmentKeys.includes(parsedKey),
            );
            dataIsValid = unknownAssessments.length === 0;
            if (!dataIsValid) {
                errors = [
                    {
                        message: `Assessment data contains assessments that are behind disabled feature flags: ${unknownAssessments.join(
                            ' ',
                        )}`,
                    } as ErrorObject,
                ];
            }
        }

        return {
            dataIsValid,
            errors,
        } as AjvValidationReturnData;
    }

    private getAssessments(): readonly Readonly<Assessment>[] {
        const filteredProvider = this.getFilterProvider(
            this.assessmentsProvider,
            this.featureFlagStoreData,
        );
        return filteredProvider.all();
    }
}
