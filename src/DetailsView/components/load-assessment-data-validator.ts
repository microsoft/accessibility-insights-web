// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import Ajv, { ErrorObject, ValidateFunction } from 'ajv';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { LoadAssessmentDataSchemaProvider } from 'DetailsView/components/load-assessment-data-schema-provider';
import { isFunction } from 'lodash';
import validateAssessmentJson from './validate-assessment-json.js';

export type AjvValidationReturnData = {
    dataIsValid: boolean;
    errors: ErrorObject[] | null;
};
export class LoadAssessmentDataValidator {
    constructor(
        private readonly ajv: Ajv,
        private readonly assessmentsProvider: AssessmentsProvider,
        private readonly featureFlagStoreData: FeatureFlagStoreData,
        private readonly loadAssessmentDataSchemaProvider: LoadAssessmentDataSchemaProvider,
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
        let dataIsValid: boolean;
        let errors: ErrorObject[] | null;

        if (this.staticValidator === undefined || !isFunction(this.staticValidator)) {
            const dynamicValidator = this.ajv.compile(
                this.loadAssessmentDataSchemaProvider.getAssessmentSchema(assessments),
            );
            dataIsValid = dynamicValidator(parsedAssessmentData);
            errors = dynamicValidator.errors;
        } else {
            // We must generate the validation function on build for the mv3 extension since we no
            // longer have 'unsafe-eval' in our CSP headers, which ajv requires to compile a schema.
            dataIsValid = this.staticValidator(parsedAssessmentData);
            errors = this.staticValidator.errors;

            // We can't dynamically check which feature flags are set in our assessment validator,
            // so check it here instead.
            if (dataIsValid) {
                const unknownAssessments = Object.keys(
                    parsedAssessmentData.assessmentData.assessments,
                ).filter(
                    parsedKey =>
                        !assessments.some(knownAssessment => knownAssessment.key === parsedKey),
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
