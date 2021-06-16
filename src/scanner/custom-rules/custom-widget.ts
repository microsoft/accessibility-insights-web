// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { generateARIACuesDictionary, generateHTMLCuesDictionary } from '../cues';
import { RuleConfiguration } from '../iruleresults';

const checkId = 'custom-widget';
export const customWidgetConfiguration: RuleConfiguration = {
    checks: [
        {
            id: checkId,
            evaluate: evaluateCustomWidget,
        },
    ],
    rule: {
        id: 'custom-widget',
        selector: createSelector(),
        enabled: false,
        any: [checkId],
    },
};

function createSelector(): string {
    const roles = [
        'alert',
        'alertdialog',
        'button',
        'checkbox',
        'combobox',
        'dialog',
        'feed',
        'grid',
        'link',
        'listbox',
        'menu',
        'menubar',
        'radiogroup',
        'separator',
        'slider',
        'spinbutton',
        'table',
        'tablist',
        'toolbar',
        'tooltip',
        'tree',
        'treegrid',
    ];

    const selectors: string[] = [];
    roles.forEach((role: string) => {
        selectors.push('[role=' + role + ']');
    });

    return selectors.join(',');
}

function evaluateCustomWidget(node: HTMLElement): boolean {
    const accessibleName = AxeUtils.getAccessibleText(node);
    const role = node.getAttribute('role');
    const describedBy = AxeUtils.getAccessibleDescription(node);
    const htmlCues = generateHTMLCuesDictionary(node);
    const ariaCues = generateARIACuesDictionary(node);

    const data = {
        accessibleName,
        role,
        describedBy,
        htmlCues,
        ariaCues,
    };

    // tslint:disable-next-line:no-invalid-this
    this.data(data);

    return true;
}
