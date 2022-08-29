// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import Ajv, { ErrorObject } from 'ajv';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { LoadAssessmentDataSchemaProvider } from 'DetailsView/components/load-assessment-data-schema-provider.js';
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
    ) {}

    public uploadedDataIsValid(
        parsedAssessmentData: VersionedAssessmentData,
    ): AjvValidationReturnData {
        let dataIsValid: boolean;
        let errors: ErrorObject[] | null;

        if (validateAssessmentJson) {
            // We must generate the validation function on build for the mv3 extension since we no
            // longer have 'unsafe-eval' in our CSP headers, which ajv requires to compile a schema.
            dataIsValid = validateAssessmentJson(parsedAssessmentData);
            errors = validateAssessmentJson.errors;
        } else {
            const assessments = this.getAssessments();
            const validateFunction = this.ajv.compile(
                LoadAssessmentDataSchemaProvider.getAssessmentSchema(assessments),
            );
            dataIsValid = validateFunction(parsedAssessmentData);
            errors = validateFunction.errors;
        }

        return {
            dataIsValid,
            errors,
        } as AjvValidationReturnData;
    }

    private getAssessments(): readonly Readonly<Assessment>[] {
        const filteredProvider = assessmentsProviderWithFeaturesEnabled(
            this.assessmentsProvider,
            this.featureFlagStoreData,
        );
        return filteredProvider.all();
    }
}
