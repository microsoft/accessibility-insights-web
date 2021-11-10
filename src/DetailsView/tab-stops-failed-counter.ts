// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';

export class TabStopsFailedCounter {
    public getFailedByRequirementId = (
        results: TabStopsRequirementResult[],
        requirementId: string,
    ): number => {
        return results.reduce((total, result) => {
            return result.id === requirementId ? total + result.instances.length : total;
        }, 0);
    };

    public getTotalFailed = (results: TabStopsRequirementResult[]): number => {
        return results.reduce((total, result) => {
            return total + result.instances.length;
        }, 0);
    };
}
