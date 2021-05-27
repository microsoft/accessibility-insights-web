// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import Ajv, { ErrorObject } from 'ajv';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';

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
        const validateFunction = this.ajv.compile(this.getAssessmentSchema());
        const valid = validateFunction(parsedAssessmentData);
        return { dataIsValid: valid, errors: validateFunction.errors } as AjvValidationReturnData;
    }

    private getAssessmentSchema() {
        let schema = this.getAssessmentSchemaBase();
        const assessments = this.getAssessments();

        assessments.forEach(assessment => {
            schema = this.setAssessmentBaseProperties(schema, assessment.key);

            assessment.requirements.forEach(requirement => {
                schema = this.setRequirementBaseProperties(schema, requirement.key, assessment.key);
            });
        });

        schema = this.setDeprecatedRequirementProperties(schema);

        return schema;
    }

    private setDeprecatedRequirementProperties(schema: any) {
        const deprecatedRequirements = [
            { assessmentKey: 'automated-checks', requirementKey: 'duplicate-id' },
        ];
        deprecatedRequirements.forEach(requirement => {
            if (
                schema.properties.assessmentData.properties.assessments.properties[
                    requirement.assessmentKey
                ] === undefined
            ) {
                schema = this.setAssessmentBaseProperties(schema, requirement.assessmentKey);
            }

            schema = this.setRequirementBaseProperties(
                schema,
                requirement.requirementKey,
                requirement.assessmentKey,
            );
        });
        return schema;
    }

    private setAssessmentBaseProperties(schema: any, assessmentKey: string) {
        const assessments = schema.properties.assessmentData.properties.assessments.properties;
        assessments[assessmentKey] = this.getBaseAssessmentObject();
        return schema;
    }

    private setRequirementBaseProperties(
        schema: any,
        requirementKey: string,
        assessmentKey: string,
    ) {
        const assessments = schema.properties.assessmentData.properties.assessments.properties;

        assessments[assessmentKey].properties.manualTestStepResultMap.properties[requirementKey] =
            this.getBaseManualTestStepResultMapObject();

        assessments[assessmentKey].properties.testStepStatus.properties[requirementKey] =
            this.getBaseTestStepStatus();
        return schema;
    }

    private getAssessments(): readonly Readonly<Assessment>[] {
        const filteredProvider = assessmentsProviderWithFeaturesEnabled(
            this.assessmentsProvider,
            this.featureFlagStoreData,
        );
        return filteredProvider.all();
    }

    private getBaseTestStepStatus() {
        return {
            type: 'object',
            properties: {
                stepFinalResult: {
                    type: 'integer',
                },
                isStepScanned: {
                    type: 'boolean',
                },
            },
            required: ['stepFinalResult', 'isStepScanned'],
            additionalProperties: false,
        };
    }

    private getBaseManualTestStepResultMapObject() {
        return {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                },
                id: {
                    type: 'string',
                },
                instances: {
                    type: 'array',
                    items: {},
                },
            },
            required: ['status', 'id', 'instances'],
            additionalProperties: false,
        };
    }

    private getBaseAssessmentObject() {
        return {
            type: 'object',
            properties: {
                fullAxeResultsMap: { type: ['object', 'null'] },
                generatedAssessmentInstancesMap: {
                    type: ['object', 'null'],
                },
                manualTestStepResultMap: {
                    type: ['object', 'null'],
                    properties: {},
                    additionalProperties: false,
                },
                testStepStatus: {
                    type: ['object', 'null'],
                    properties: {},
                    additionalProperties: false,
                },
                scanIncompleteWarnings: {
                    type: 'array',
                },
            },
            additionalProperties: false,
        };
    }

    private getAssessmentSchemaBase() {
        return {
            type: 'object',
            properties: {
                version: {
                    type: 'integer',
                },
                assessmentData: {
                    type: 'object',
                    properties: {
                        persistedTabInfo: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                },
                                url: {
                                    type: 'string',
                                },
                                title: {
                                    type: 'string',
                                },
                                appRefreshed: {
                                    type: 'boolean',
                                },
                            },
                            additionalProperties: false,
                        },
                        assessmentNavState: {
                            type: 'object',
                            properties: {
                                selectedTestType: {
                                    type: 'integer',
                                },
                                selectedTestSubview: {
                                    type: 'string',
                                },
                                expandedTestType: {
                                    type: 'integer',
                                },
                            },
                            additionalProperties: false,
                        },
                        assessments: {
                            type: 'object',
                            properties: {},
                            additionalProperties: false,
                        },
                        resultDescription: {
                            type: 'string',
                        },
                    },
                    required: [
                        'persistedTabInfo',
                        'assessmentNavState',
                        'assessments',
                        'resultDescription',
                    ],
                    additionalProperties: false,
                },
            },
            required: ['version', 'assessmentData'],
            additionalProperties: false,
        };
    }
}
