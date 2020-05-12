// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DecoratedAxeNodeResult } from 'injected/scanner-utils';
import { some } from 'lodash';

export function doesResultHaveMainRole(instance: DecoratedAxeNodeResult): boolean {
    return (
        some(instance.any, checkResult => checkResult.data['role'] === 'main') ||
        some(instance.all, checkResult => checkResult.data['role'] === 'main')
    );
}
