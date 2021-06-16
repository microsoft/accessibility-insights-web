// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { AxeNodeResult, RuleConfiguration } from '../iruleresults';
import { RoleUtils } from '../role-utils';

const checkId = 'link-function';
const snippetKey = 'snippet';
const hasValidRoleIfPresent = 'valid-role-if-present';
export const linkFunctionConfiguration: RuleConfiguration = {
    checks: [
        {
            id: checkId,
            evaluate: evaluateLinkFunction,
        },
        {
            id: hasValidRoleIfPresent,
            evaluate: RoleUtils.isValidRoleIfPresent,
        },
    ],
    rule: {
        id: 'link-function',
        selector: 'a',
        any: [checkId],
        all: [hasValidRoleIfPresent],
        none: ['has-widget-role'],
        matches: matches,
        decorateNode: (node: AxeNodeResult) => {
            if (node.any.length > 0) {
                node.snippet = node.any[0].data[snippetKey];
            }
        },
        enabled: false,
    },
};

function matches(node: HTMLElement, virtualNode: HTMLElement): boolean {
    const href = node.getAttribute('href');
    return !href || href === '#' || AxeUtils.hasCustomWidgetMarkup(node);
}

function evaluateLinkFunction(
    node: HTMLElement,
    options: any,
    virtualNode: any,
    context: any,
): boolean {
    const accessibleName = AxeUtils.getAccessibleText(node);
    const ariaValues = AxeUtils.getPropertyValuesMatching(node, /^aria-/);
    const role = node.getAttribute('role');
    const tabIndex = node.getAttribute('tabindex');
    const url = node.getAttribute('href');

    const data = {
        accessibleName,
        ariaAttributes: ariaValues,
        role,
        tabIndex,
        url,
    };

    const missingNameOrUrl = !accessibleName || !url;
    const snippet =
        missingNameOrUrl && node.parentElement != null
            ? node.parentElement.outerHTML
            : node.outerHTML;

    data[snippetKey] = snippet;
    // tslint:disable-next-line:no-invalid-this
    this.data(data);

    return true;
}
