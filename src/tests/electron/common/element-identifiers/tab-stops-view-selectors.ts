// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { tabStopsToggleAutomationId } from 'electron/views/tab-stops/tab-stops-testing-content';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const TabStopsViewSelectors = {
    tabStopsToggle: getAutomationIdSelector(tabStopsToggleAutomationId),
};
