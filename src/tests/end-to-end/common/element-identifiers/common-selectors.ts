// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { gearButtonAutomationId } from 'DetailsView/components/details-view-dropdown';
import { getAutomationIdSelector } from 'tests/end-to-end/common/element-identifiers/get-automation-id-selector';

export const CommonSelectors = {
    settingsGearButton: getAutomationIdSelector(gearButtonAutomationId),
    settingsDropdownMenu: '#settings-dropdown-menu',
    previewFeaturesDropdownButton: '.preview-features-drop-down-button',
    highContrastThemeSelector: 'body.high-contrast-theme',
    anyModalDialog: '[role~="dialog"][aria-modal="true"]', // ~="dialog" catches "alertdialog" too
};

export const GuidanceContentSelectors = {
    mainContentContainer: '.content-container',
};
