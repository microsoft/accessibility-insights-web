// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from '../axe-utils';
import { RuleConfiguration } from '../iruleresults';

const accessibleNamesCheckId: string = 'display-accessible-names';

export const accessibleNamesConfiguration: RuleConfiguration = {
    checks: [
        {
            id: accessibleNamesCheckId, // unique name of rule
            evaluate: evaluateAccessibleNames, // required for new checkIDs. String for function that implements check's functionality
        },
    ],

    /**
     * Selector: Each element matching selector will be tested by the rule unless matches function says otherwise
     * matches property returns a boolean indicating if an object should be tested
     */
    rule: {
        id: accessibleNamesCheckId,

        // the UI components we care about
        selector: createSelector(),
        enabled: false,
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

function evaluateAccessibleNames(node: HTMLElement): boolean {
    //return true if check is passed. Otherwise false
    const accessibleName = AxeUtils.getAccessibleText(node);
    if (accessibleName) {
        this.data({ name: accessibleName });
    }
    return true;
}
