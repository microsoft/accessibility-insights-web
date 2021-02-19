// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedFeatureFlags } from 'electron/common/unified-feature-flags';
import { TestConfig } from 'electron/types/test-config';
import { TabStopsTestingContent } from 'electron/views/tab-stops/tab-stops-testing-content';
import { VirtualKeyboardView } from 'electron/views/tab-stops/virtual-keyboard-view';

export const tabStopsTestConfig: TestConfig = {
    key: 'tab-stops',
    contentPageInfo: {
        title: 'Tab stops',
        resultsFilter: _ => false,
        allowsExportReport: false,
        visualHelperSection: VirtualKeyboardView,
        instancesSectionComponent: TabStopsTestingContent,
    },
    featureFlag: UnifiedFeatureFlags.tabStops,
};
