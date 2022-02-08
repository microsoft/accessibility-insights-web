// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';

export interface TabStopsFailedCounter {
    getTotalFailedByRequirementId: (
        results: TabStopsRequirementResult[],
        requirementId: string,
    ) => number;
    getFailedInstancesByRequirementId: (
        results: TabStopsRequirementResult[],
        requirementId: string,
    ) => number;
    getTotalFailed: (results: TabStopsRequirementResult[]) => number;
}

export class TabStopsFailedCounterInstancesOnly implements TabStopsFailedCounter {
    public getTotalFailedByRequirementId = getFailedInstancesByRequirementId;

    public getFailedInstancesByRequirementId = getFailedInstancesByRequirementId;

    public getTotalFailed = (results: TabStopsRequirementResult[]): number => {
        return results.reduce((total, result) => {
            return total + result.instances.length;
        }, 0);
    };
}

export class TabStopsFailedCounterIncludingNoInstance implements TabStopsFailedCounter {
    public getTotalFailedByRequirementId = (
        results: TabStopsRequirementResult[],
        requirementId: string,
    ): number => {
        return results.reduce((total, result) => {
            return result.id === requirementId ? total + (result.instances.length || 1) : total;
        }, 0);
    };

    public getFailedInstancesByRequirementId = getFailedInstancesByRequirementId;

    public getTotalFailed = (results: TabStopsRequirementResult[]): number => {
        return results.reduce((total, result) => {
            return total + (result.instances.length || 1);
        }, 0);
    };
}

const getFailedInstancesByRequirementId = (
    results: TabStopsRequirementResult[],
    requirementId: string,
): number => {
    return results.reduce((total, result) => {
        return result.id === requirementId ? total + result.instances.length : total;
    }, 0);
};
