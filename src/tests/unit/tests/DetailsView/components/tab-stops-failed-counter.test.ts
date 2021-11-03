// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';

// Licensed under the MIT License.
describe('TabStopsFailedCounter', () => {
    let results = [] as TabStopsRequirementResult[];

    beforeEach(() => {
        results = [
            { instances: [{ id: 'test-id-1', description: 'test desc 1' }] },
        ] as TabStopsRequirementResult[];
    });

    test('getTotalFailed returns zero when there are no instances', () => {
        results = [];
        expect(TabStopsFailedCounter.getTotalFailed(results)).toBe(0);
    });

    test('getTotalFailed returns one result when a single failed instance is passed', () => {
        results = [
            { instances: [{ id: 'test-id-1', description: 'test desc 1' }] },
        ] as TabStopsRequirementResult[];
        expect(TabStopsFailedCounter.getTotalFailed(results)).toBe(1);
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
        expect(TabStopsFailedCounter.getTotalFailed(results)).toBe(3);
    });

    test('getFailedByRequirementId returns zero when requirementId does not exist', () => {
        results = [
            {
                id: 'keyboard-navigation',
                instances: [{ id: 'test-id-1', description: 'test desc 1' }],
            },
        ] as TabStopsRequirementResult[];
        expect(TabStopsFailedCounter.getFailedByRequirementId(results, 'non-existent-id')).toBe(0);
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
        expect(TabStopsFailedCounter.getFailedByRequirementId(results, 'input-focus')).toBe(2);
    });
});
