// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import styles from 'assessments/assessment-default-message-generator.scss';
import { GeneratedAssessmentInstance } from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';

describe('AssessmentDefaultMessageGenerator', () => {
    const testSubject = new AssessmentDefaultMessageGenerator();

    test('the getNoFailingInstanceMessage returns null when there are instances and also when there are no failing', () => {
        expect(testSubject.getNoFailingInstanceMessage).toBeDefined();

        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector1: {
                target: ['target1'],
                html: 'html',
                testStepResults: {
                    step: {
                        status: ManualTestStatus.FAIL,
                        originalStatus: 2,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
            selector2: {
                target: ['target2'],
                html: 'html',
                testStepResults: {
                    step2: {
                        status: ManualTestStatus.PASS,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
        };

        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step1')).not.toBeNull();
        const expected = {
            message: <div className={styles.noFailureView}>No matching instances</div>,
            instanceCount: 0,
        };
        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step1')).toEqual(expected);
    });

    test('the getNoMatchingInstanceMessage returns null when there are instances and also when they are not failing', () => {
        expect(testSubject.getNoFailingInstanceMessage).toBeDefined();

        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector1: {
                target: ['target1'],
                html: 'html',
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.FAIL,
                        originalStatus: 2,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
            selector2: {
                target: ['target2'],
                html: 'html',
                testStepResults: {
                    step2: {
                        status: ManualTestStatus.PASS,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
        };

        expect(testSubject.getNoMatchingInstanceMessage(instancesMap, 'step1')).toBeNull();
    });

    test('test no failing instance for empty instancesmap', () => {
        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {};

        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step1')).not.toBeNull();

        const expected = {
            message: <div className={styles.noFailureView}>No matching instances</div>,
            instanceCount: 0,
        };

        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step1')).toEqual(expected);
    });

    test('no matching instance for empty instance map', () => {
        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {};
        const expected = {
            message: <div className={styles.noFailureView}>No matching instances</div>,
            instanceCount: 0,
        };
        expect(testSubject.getNoMatchingInstanceMessage(instancesMap, 'step1')).not.toBeNull();

        expect(testSubject.getNoMatchingInstanceMessage(instancesMap, 'step1')).toEqual(expected);
    });

    test('the getNoFailingInstanceMessage returns no failing instances message when there are instances but no failing ones', () => {
        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector1: {
                target: ['tareget1'],
                html: 'html',
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.PASS,
                        originalStatus: 2,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
            selector2: {
                target: ['tareget2'],
                html: 'html',
                testStepResults: {
                    step2: {
                        status: ManualTestStatus.FAIL,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
        };

        const expected = {
            message: <div className={styles.noFailureView}>No failing instances</div>,
            instanceCount: 1,
        };

        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step1')).not.toBeNull();
        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step2')).toBeNull();

        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step1')).toEqual(expected);
        expect(testSubject.getNoFailingInstanceMessage(instancesMap, 'step2')).toEqual(null);
    });

    test('if the getNoMatchingInstanceMessage returns no failing instances message when there are instances but no failing ones', () => {
        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
            selector1: {
                target: ['tareget1'],
                html: 'html',
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.PASS,
                        originalStatus: 2,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
            selector2: {
                target: ['tareget2'],
                html: 'html',
                testStepResults: {
                    step2: {
                        status: ManualTestStatus.PASS,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
        };

        expect(testSubject.getNoMatchingInstanceMessage(instancesMap, 'step1')).toBeNull();
        expect(testSubject.getNoMatchingInstanceMessage(instancesMap, 'step2')).toBeNull();
    });
});
