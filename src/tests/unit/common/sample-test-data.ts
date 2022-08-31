// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export const ShortcutCommandsTestData: chrome.commands.Command[] = [
    {
        description: 'Activate the extension',
        name: '_execute_browser_action',
        shortcut: 'Ctrl+Shift+K',
    },
    { description: 'Toggle Automated checks', name: '01_toggle-issues', shortcut: 'Ctrl+Shift+1' },
    { description: 'Toggle Landmarks', name: '02_toggle-landmarks', shortcut: 'Ctrl+Shift+2' },
    { description: 'Toggle Headings', name: '03_toggle-headings', shortcut: 'Ctrl+Shift+3' },
    { description: 'Toggle Tab stops', name: '04_toggle-tabStops', shortcut: '' },
    { description: 'Toggle Color', name: '05_toggle-color', shortcut: '' },
    { description: 'Toggle Needs review', name: '06_toggle-needsReview', shortcut: '' },
    { description: 'Toggle Accessible names', name: '07_toggle-accessibleNames', shortcut: '' },
];
