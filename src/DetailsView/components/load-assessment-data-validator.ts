// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import Ajv from 'ajv';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';

export class LoadAssessmentDataValidator {
    constructor(
        private readonly ajv: Ajv,
        private readonly assessmentsProvider: AssessmentsProvider,
        private readonly featureFlagStoreData: FeatureFlagStoreData,
    ) {}

    public uploadedDataIsValid(
        parsedAssessmentData: VersionedAssessmentData,
    ): boolean | PromiseLike<any> {
        const validateFunction = this.ajv.compile(this.getAssessmentSchema());
        const valid = validateFunction(parsedAssessmentData);

        if (!valid) {
            console.log(validateFunction.errors);
        }
        return valid;
    }

    private buildAssessmentSchema() {
        const schema = this.getAssessmentSchemaBase();
        const assessments = this.getAssessments();
        assessments.forEach(assessment => {
            const assessments = schema.properties.assessmentData.properties.assessments.properties;
            assessments[assessment.key] = this.getBaseAssessmentObject();
            assessment.requirements.forEach(requirement => {
                assessments[assessment.key].properties.manualTestStepResultMap.properties[
                    requirement.key
                ] = this.getBaseManualTestStepResultMapObject();
                assessments[assessment.key].properties.testStepStatus.properties[
                    requirement.key
                ] = this.getBaseTestStepStatus();
            });
        });
        console.log(schema);
        return schema;
    }

    private getAssessmentSchema() {
        return this.buildAssessmentSchema();
    }

    private getAssessments() {
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
                            // properties: {
                            //     'automated-checks': {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //             scanIncompleteWarnings: {
                            //                 type: 'array',
                            //             },
                            //         },
                            //         additionalProperties: false,
                            //     },
                            //     keyboardInteraction: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //         additionalProperties: false,
                            //     },
                            //     visibleFocusOrder: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     landmarks: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     repetitiveContent: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     linksAssessment: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     nativeWidgets: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     customWidgets: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     timedEvents: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     errors: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     page: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     parsing: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     images: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     language: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     color: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     textLegibility: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     audioVideoOnly: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     prerecordedMultimedia: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     liveMultimedia: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     sequence: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     semanticsAssessment: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     pointerMotion: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            //     contrast: {
                            //         type: 'object',
                            //         properties: {
                            //             fullAxeResultsMap: { type: ['object', 'null'] },
                            //             generatedAssessmentInstancesMap: {
                            //                 type: ['object', 'null'],
                            //             },
                            //             manualTestStepResultMap: { type: ['object', 'null'] },
                            //             testStepStatus: { type: ['object', 'null'] },
                            //         },
                            //     },
                            // },
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
