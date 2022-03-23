// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    TabStopsFailedCounterIncludingNoInstance,
    TabStopsFailedCounterInstancesOnly,
} from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';

// Licensed under the MIT License.
describe('TabStopsFailedCounter', () => {
    let results = [] as TabStopsRequirementResult[];
    const testSubjectInstancesOnly = new TabStopsFailedCounterInstancesOnly();
    const testSubjectIncludingNoInstance = new TabStopsFailedCounterIncludingNoInstance();

    beforeEach(() => {
        results = [
            { instances: [{ id: 'test-id-1', description: 'test desc 1' }] },
        ] as TabStopsRequirementResult[];
    });

    test('getTotalFailed returns zero when there are no instances', () => {
        results = [];
        expect(testSubjectInstancesOnly.getTotalFailed(results)).toBe(0);
        expect(testSubjectIncludingNoInstance.getTotalFailed(results)).toBe(0);
    });

    test('getTotalFailed returns one result when a single failed instance is passed', () => {
        results = [
            { instances: [{ id: 'test-id-1', description: 'test desc 1' }] },
        ] as TabStopsRequirementResult[];
        expect(testSubjectInstancesOnly.getTotalFailed(results)).toBe(1);
        expect(testSubjectIncludingNoInstance.getTotalFailed(results)).toBe(1);
    });

    test('getTotalFailed counts all instances from all requirements', () => {
        results = [
            {
                id: 'keyboard-navigation',
                instances: [{ id: 'test-id-1', description: 'test desc 1' }],
            },
            {
                id: 'input-focus',
                instances: [
                    { id: 'test-id-2', description: 'test desc 2' },
                    { id: 'test-id-3', description: 'test desc 3' },
                ],
            },
        ] as TabStopsRequirementResult[];
        expect(testSubjectInstancesOnly.getTotalFailed(results)).toBe(3);
        expect(testSubjectIncludingNoInstance.getTotalFailed(results)).toBe(3);
    });

    test('getTotalFailed counts requirements without instances based on implementation', () => {
        results = [
            {
                id: 'keyboard-navigation',
                instances: [{ id: 'test-id-1', description: 'test desc 1' }],
            },
            {
                id: 'input-focus',
                instances: [],
            },
        ] as TabStopsRequirementResult[];
        expect(testSubjectInstancesOnly.getTotalFailed(results)).toBe(1);
        expect(testSubjectIncludingNoInstance.getTotalFailed(results)).toBe(2);
    });

    test('getFailedByRequirementId returns zero when requirementId does not exist', () => {
        results = [
            {
                id: 'keyboard-navigation',
                instances: [{ id: 'test-id-1', description: 'test desc 1' }],
            },
        ] as TabStopsRequirementResult[];
        expect(
            testSubjectInstancesOnly.getTotalFailedByRequirementId(results, 'non-existent-id'),
        ).toBe(0);
        expect(
            testSubjectIncludingNoInstance.getTotalFailedByRequirementId(
                results,
                'non-existent-id',
            ),
        ).toBe(0);
    });

    test('getFailedByRequirementId returns correct number of instances for requirement', () => {
        results = [
            {
                id: 'keyboard-navigation',
                instances: [{ id: 'test-id-1', description: 'test desc 1' }],
            },
            {
                id: 'input-focus',
                instances: [
                    { id: 'test-id-2', description: 'test desc 2' },
                    { id: 'test-id-3', description: 'test desc 3' },
                ],
            },
        ] as TabStopsRequirementResult[];
        expect(testSubjectInstancesOnly.getTotalFailedByRequirementId(results, 'input-focus')).toBe(
            2,
        );
        expect(
            testSubjectIncludingNoInstance.getTotalFailedByRequirementId(results, 'input-focus'),
        ).toBe(2);
    });

    test('getFailedByRequirementId returns correct number for requirement with no instances', () => {
        results = [
            {
                id: 'keyboard-navigation',
                instances: [{ id: 'test-id-1', description: 'test desc 1' }],
            },
            {
                id: 'input-focus',
                instances: [],
            },
        ] as TabStopsRequirementResult[];
        expect(testSubjectInstancesOnly.getTotalFailedByRequirementId(results, 'input-focus')).toBe(
            0,
        );
        expect(
            testSubjectIncludingNoInstance.getTotalFailedByRequirementId(results, 'input-focus'),
        ).toBe(1);
    });
});
