// Copyright (c) Microsoft Corporation. All rights reserved.
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { some } from 'lodash';

// Licensed under the MIT License.
export function doesResultHaveMainRole(instance: DecoratedAxeNodeResult): boolean {
    return (
        some(instance.any, checkResult => checkResult.data['role'] === 'main') ||
        some(instance.all, checkResult => checkResult.data['role'] === 'main')
    );
}
