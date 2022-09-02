// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Assessment } from 'assessments/types/iassessment';

export class LoadAssessmentDataSchemaProvider {
    public getAssessmentSchema(assessments: readonly Readonly<Assessment>[]): any {
        let schema = this.getAssessmentSchemaBase();

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
            { assessmentKey: 'automated-checks', requirementKey: 'scrollable-region-focusable' },
        ];
        deprecatedRequirements.forEach(requirement => {
            if (this.getAssessments(schema)[requirement.assessmentKey] === undefined) {
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
        const assessments = this.getAssessments(schema);
        assessments[assessmentKey] = this.getBaseAssessmentObject();
        return schema;
    }

    private setRequirementBaseProperties(
        schema: any,
        requirementKey: string,
        assessmentKey: string,
    ) {
        const assessments = this.getAssessments(schema);

        assessments[assessmentKey].properties.manualTestStepResultMap.properties[requirementKey] =
            this.getBaseManualTestStepResultMapObject();

        assessments[assessmentKey].properties.testStepStatus.properties[requirementKey] =
            this.getBaseTestStepStatus();
        return schema;
    }

    private getAssessments(schema: any) {
        return schema.properties.assessmentData.properties.assessments.properties;
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
                                detailsViewId: {
                                    type: 'string',
                                },
                                // This field is depreciated and no longer used, but included for
                                // the sake of backwards compatibility
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
                                    type: ['integer', 'null'],
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
