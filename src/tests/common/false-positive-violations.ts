// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Result } from 'axe-core';
import { AxeInfo } from '../../common/axe-info';

const axeInfo = AxeInfo.Default;

// this is a method to remove violations tied to rules with known false-positives and was introduced
// Jan 25 2023 to remove aria-required-children failures introduced by axe-core 4.6.1
// we should keep this in until Deque introduces the fix for the issues tracked here
// https://github.com/dequelabs/axe-core/issues/3850
// the axe-core bug causes a failure for the FluentUI v8 DetailsList component
// The FluentUI tracking issue can be found here:
// https://github.com/microsoft/fluentui/issues/26330
export function falsePositiveRemoval(violations: Result[]): Result[] {
    // Re-evaluate if the false positive is still present in future axe-core versions
    if (axeInfo.version !== '4.6.3') {
        console.log('Axe Core version has changed. Please check if this is still needed');
        return violations;
    }
    const newViolations = [] as Result[];
    //can be modified if other rules with false positives are identified
    const knownFalsePositives = ['aria-required-children'];
    violations.forEach(function (x) {
        if (!knownFalsePositives.includes(x.id)) {
            newViolations.push(x);
        }
    });
    return newViolations;
}
