// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { indexOf } from 'lodash';

import { ManualTestStatus } from '../types/manual-test-status';
import { RequirementOrderPart } from './requirement';

const orderOfOutcomes = [
    ManualTestStatus.UNKNOWN,
    ManualTestStatus.FAIL,
    ManualTestStatus.PASS,
];

const byOrdinal: RequirementOrderPart = r => r.definition.order;
const byName: RequirementOrderPart = r => r.definition.name;
const byOutcome: RequirementOrderPart = r =>
    indexOf(orderOfOutcomes, r.data.stepFinalResult);

export const RequirementComparer = {
    byOrdinal,
    byName,
    byOutcome,
    byOutcomeAndName: [byOutcome, byName],
};
