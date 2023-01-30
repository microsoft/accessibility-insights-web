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
        throw new Error('Axe Core version has changed. Please check if this is still needed');
    }
    let newViolations = violations.map(function (violation) {
        if (violation.id === 'aria-required-children') {
            const newNodes = violation.nodes.filter(
                node =>
                    !(
                        node.html.includes('ms-DetailsHeader') ||
                        node.html.includes('ms-DetailsRow')
                    ),
            );
            violation.nodes = newNodes;
        }
        return violation;
    });
    newViolations = newViolations.filter(violation => violation.nodes.length > 0);
    return newViolations;
}
