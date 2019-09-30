// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const CommonSelectors = {
    settingsGearButton: '.gear-button',
    settingsDropdownMenu: '#settings-dropdown-menu',
    previewFeaturesDropdownButton: '.preview-features-drop-down-button',
    highContrastThemeSelector: 'body.high-contrast-theme',
    anyModalDialog: '[role~="dialog"][aria-modal="true"]', // ~="dialog" catches "alertdialog" too
};

export const GuidanceContentSelectors = {
    mainContentContainer: '.content-container',
};
