// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { sumBy } from 'lodash';

import { RequirementOutcomeStats } from './requirement-outcome-type';

function percentageComplete(stats: RequirementOutcomeStats): number {
    const complete = stats.pass + stats.fail;
    const total = stats.pass + stats.fail + stats.incomplete;
    return Math.round((100 * complete) / total);
}

function normalize(stats: RequirementOutcomeStats): RequirementOutcomeStats {
    const total = stats.pass + stats.incomplete + stats.fail;
    return {
        pass: stats.pass / total,
        incomplete: stats.incomplete / total,
        fail: stats.fail / total,
    };
}

function sum(statsArray: RequirementOutcomeStats[]): RequirementOutcomeStats {
    return {
        pass: sumBy(statsArray, data => data.pass),
        fail: sumBy(statsArray, data => data.fail),
        incomplete: sumBy(statsArray, data => data.incomplete),
    };
}

function weightedPercentage(
    statsArray: RequirementOutcomeStats[],
): RequirementOutcomeStats {
    return percentize(sum(statsArray.map(normalize)));
}

function percentize(stats: RequirementOutcomeStats): RequirementOutcomeStats {
    const normal = normalize(stats);

    const pass = Math.round(normal.pass * 100);
    const fail = Math.round(normal.fail * 100);
    const incomplete = 100 - pass - fail;

    return { pass, fail, incomplete };
}

export const OutcomeMath = {
    sum,
    weightedPercentage,
    percentageComplete,
};
