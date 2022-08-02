// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { RuleConfiguration } from '../iruleresults';

const accessibleNamesCheckId: string = 'display-accessible-names';

export const accessibleNamesConfiguration: RuleConfiguration = {
    checks: [
        {
            id: accessibleNamesCheckId,
            evaluate: evaluateAccessibleNames,
        },
    ],
    rule: {
        id: accessibleNamesCheckId,
        selector: createSelector(),
        enabled: false,
        any: [accessibleNamesCheckId],
        matches: hasAccessibleName,
    },
};

function createSelector(): string {
    const roles = [
        'alertdialog',
        'application',
        'button',
        'checkbox',
        'columnheader',
        'combobox',
        'dialog',
        'grid',
        'heading',
        'img',
        'link',
        'listbox',
        'marquee',
        'meter',
        'menuitem',
        'menuitemcheckbox',
        'menuitemradio',
        'option',
        'progressbar',
        'radio',
        'radiogroup',
        'region',
        'rowheader',
        'searchbox',
        'slider',
        'spinbutton',
        'switch',
        'table',
        'tabpanel',
        'textbox',
        'tooltip',
        'tree',
        'treegrid',
        'treeitem',
    ];

    const selectors: string[] = [];
    roles.forEach((role: string) => {
        selectors.push('[role=' + role + ']', role);
    });
    return selectors.join(',');
}

function hasAccessibleName(element: any): boolean {
    const accessibleText = AxeUtils.getAccessibleText(element); // get the accessible name
    if (accessibleText != null) {
        return true;
    }
}

function evaluateAccessibleNames(node: HTMLElement): boolean {
    const accessibleName = AxeUtils.getAccessibleText(node);
    if (accessibleName != null) {
        this.data({ accessibleName });
    }
    return true;
}
