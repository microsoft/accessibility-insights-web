// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Assessment } from 'assessments/types/iassessment';
import { LoadAssessmentDataSchemaProvider } from 'DetailsView/components/load-assessment-data-schema-provider';
import { forEach } from 'lodash';

describe(LoadAssessmentDataSchemaProvider, () => {
    let testSubject: LoadAssessmentDataSchemaProvider;
    let assessmentsStub: Assessment[];

    beforeEach(() => {
        testSubject = new LoadAssessmentDataSchemaProvider();
    });

    it('Schema is correct with no assessments', () => {
        assessmentsStub = [];
        const schema = testSubject.getAssessmentSchema(assessmentsStub);
        expect(schema).toEqual(getExpectedSchema(assessmentsStub));
    });

    it('Schema is correct with assessments', () => {
        assessmentsStub = [
            { key: 'assessment1', requirements: [] } as Assessment,
            { key: 'assessment2', requirements: [] } as Assessment,
        ];
        const schema = testSubject.getAssessmentSchema(assessmentsStub);
        expect(schema).toEqual(getExpectedSchema(assessmentsStub));
    });

    function getExpectedSchema(assessments: Assessment[]) {
        const stepProperties = {
            additionalProperties: false,
            properties: {
                id: { type: 'string' },
                instances: { items: {}, type: 'array' },
                status: { type: 'integer' },
            },
            required: ['status', 'id', 'instances'],
            type: 'object',
        };
        const statusProperties = {
            additionalProperties: false,
            properties: {
                isStepScanned: { type: 'boolean' },
                stepFinalResult: { type: 'integer' },
            },
            required: ['stepFinalResult', 'isStepScanned'],
            type: 'object',
        };

        let properties = {};
        assessments = assessments.concat({ key: 'automated-checks' } as Assessment);
        forEach(assessments, assessment => {
            properties = {
                ...properties,
                [assessment.key]: {
                    additionalProperties: false,
                    properties: {
                        fullAxeResultsMap: { type: ['object', 'null'] },
                        generatedAssessmentInstancesMap: {
                            type: ['object', 'null'],
                        },
                        manualTestStepResultMap: {
                            additionalProperties: false,
                            properties:
                                assessment.key === 'automated-checks'
                                    ? {
                                          'aria-roledescription': stepProperties,
                                          'duplicate-id': stepProperties,
                                          'duplicate-id-active': stepProperties,
                                          'duplicate-id-aria': stepProperties,
                                      }
                                    : {},
                            type: ['object', 'null'],
                        },
                        scanIncompleteWarnings: { type: 'array' },
                        testStepStatus: {
                            additionalProperties: false,
                            properties:
                                assessment.key === 'automated-checks'
                                    ? {
                                          'aria-roledescription': statusProperties,
                                          'duplicate-id': statusProperties,
                                          'duplicate-id-active': statusProperties,
                                          'duplicate-id-aria': statusProperties,
                                      }
                                    : {},
                            type: ['object', 'null'],
                        },
                    },
                    type: 'object',
                },
            };
        });

        return {
            additionalProperties: false,
            properties: {
                assessmentData: {
                    additionalProperties: false,
                    properties: {
                        assessmentNavState: {
                            additionalProperties: false,
                            properties: {
                                expandedTestType: { type: ['integer', 'null'] },
                                selectedTestSubview: { type: 'string' },
                                selectedTestType: { type: 'integer' },
                            },
                            type: 'object',
                        },
                        assessments: {
                            additionalProperties: false,
                            properties,
                            type: 'object',
                        },
                        persistedTabInfo: {
                            additionalProperties: false,
                            properties: {
                                appRefreshed: { type: 'boolean' },
                                detailsViewId: { type: 'string' },
                                id: { type: 'integer' },
                                title: { type: 'string' },
                                url: { type: 'string' },
                            },
                            type: 'object',
                        },
                        resultDescription: { type: 'string' },
                    },
                    required: [
                        'persistedTabInfo',
                        'assessmentNavState',
                        'assessments',
                        'resultDescription',
                    ],
                    type: 'object',
                },
                version: { type: 'integer' },
            },
            required: ['version', 'assessmentData'],
            type: 'object',
        };
    }
});
