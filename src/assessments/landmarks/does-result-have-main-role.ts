// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { some } from 'lodash';

export function doesResultHaveMainRole(result: DecoratedAxeNodeResult): boolean {
    // This 'role' data is populated by the unique-landmark rule, which considers
    // both explicit role attributes and implicit roles based on tag name
    return (
        some(result.any, checkResult => checkResult.data['role'] === 'main') ||
        some(result.all, checkResult => checkResult.data['role'] === 'main')
    );
}
