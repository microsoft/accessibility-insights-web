// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { RuleConfiguration } from '../iruleresults';
import {
    createNativeWidgetConfiguration,
    getNativeWidgetElementType,
} from './native-widgets-default';

export const widgetFunctionConfiguration: RuleConfiguration = createNativeWidgetConfiguration(
    'widget-function',
    'widget-function-collector',
    evaluateWidgetFunction,
    AxeUtils.hasCustomWidgetMarkup,
);

export function evaluateWidgetFunction(node: HTMLElement): boolean {
    const ariaAttributes = [
        'aria-autocomplete',
        'aria-checked',
        'aria-expanded',
        'aria-level',
        'aria-modal',
        'aria-multiline',
        'aria-multiselectable',
        'aria-orientation',
        'aria-placeholder',
        'aria-pressed',
        'aria-readonly',
        'aria-required',
        'aria-selected',
        'aria-sort',
        'aria-valuemax',
        'aria-valuemin',
        'aria-valuenow',
        'aria-valuetext',
    ];

    // tslint:disable-next-line:no-invalid-this
    this.data({
        element: getNativeWidgetElementType(node),
        accessibleName: AxeUtils.getAccessibleText(node),
        role: node.getAttribute('role'),
        ariaAttributes: AxeUtils.getAttributes(node, ariaAttributes),
        tabIndex: node.getAttribute('tabindex'),
    });
    return true;
}
