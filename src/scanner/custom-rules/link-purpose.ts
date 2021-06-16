// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { RuleConfiguration } from '../iruleresults';
import { RoleUtils } from '../role-utils';

const checkId = 'link-purpose';
const hasValidRoleIfPresent = 'valid-role-if-present';

export const linkPurposeConfiguration: RuleConfiguration = {
    checks: [
        {
            id: checkId,
            evaluate: evaluateLinkPurpose,
        },
        {
            id: hasValidRoleIfPresent,
            evaluate: RoleUtils.isValidRoleIfPresent,
        },
    ],
    rule: {
        id: 'link-purpose',
        selector: 'a',
        any: [checkId],
        all: [hasValidRoleIfPresent],
        none: ['has-widget-role'],
        enabled: false,
    },
};

function evaluateLinkPurpose(
    node: HTMLElement,
    options: any,
    virtualNode: any,
    context: any,
): boolean {
    const accessibleName: string = AxeUtils.getAccessibleText(node);
    const accessibleDescription: string = AxeUtils.getAccessibleDescription(node);
    const url = node.getAttribute('href');

    const data = {
        element: 'link',
        accessibleName,
        accessibleDescription,
        url,
    };

    // tslint:disable-next-line:no-invalid-this
    this.data(data);
    return true;
}
