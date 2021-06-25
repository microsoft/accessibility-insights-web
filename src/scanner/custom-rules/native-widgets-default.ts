// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { RuleConfiguration } from '../iruleresults';
import { RoleUtils } from '../role-utils';

export const nativeWidgetSelector =
    'button, input[list], input[type]:not([type="hidden"]), select, textarea';

export const nativeWidgetsDefaultConfiguration = createNativeWidgetConfiguration(
    'native-widgets-default',
    'native-widgets-default-collector',
);

export function createNativeWidgetConfiguration(
    ruleId: string,
    checkId: string,
    evaluate?: (node: any, options: any, virtualNode: any, context: any) => boolean,
    matches?: (node: any, virtualNode: any) => boolean,
): RuleConfiguration {
    return {
        checks: [
            {
                id: checkId,
                evaluate: evaluate || evaluateNativeWidget,
            },
            {
                id: 'valid-role-if-present',
                evaluate: RoleUtils.isValidRoleIfPresent,
            },
        ],
        rule: {
            id: ruleId,
            selector: nativeWidgetSelector,
            any: [checkId],
            all: ['valid-role-if-present'],
            none: ['has-widget-role'],
            matches: matches,
            enabled: false,
        },
    };
}

export function evaluateNativeWidget(node: HTMLElement): boolean {
    // tslint:disable-next-line:no-invalid-this
    this.data({
        element: getNativeWidgetElementType(node),
        accessibleName: AxeUtils.getAccessibleText(node),
        accessibleDescription: AxeUtils.getAccessibleDescription(node),
    });
    return true;
}

export function getNativeWidgetElementType(node: HTMLElement): string | undefined {
    if (node.tagName === 'BUTTON' || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA') {
        return node.tagName.toLowerCase();
    } else if (node.tagName === 'INPUT' && node.hasAttribute('list')) {
        return 'input list';
    } else if (node.tagName === 'INPUT' && node.hasAttribute('type')) {
        return `input type="${node.getAttribute('type')}"`;
    }

    return undefined;
}
