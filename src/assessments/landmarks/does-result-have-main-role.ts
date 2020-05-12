// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { some } from 'lodash';

export function doesResultHaveMainRole(result: DecoratedAxeNodeResult): boolean {
    return (
        some(result.any, checkResult => checkResult.data['role'] === 'main') ||
        some(result.all, checkResult => checkResult.data['role'] === 'main')
    );
}
