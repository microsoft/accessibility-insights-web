// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { leftNavHamburgerButtonAutomationId } from 'common/components/left-nav-hamburger-button';
import { testViewLeftNavLinkAutomationId } from 'DetailsView/components/left-nav/test-view-left-nav-link';
import { exportReportCommandBarButtonId } from 'DetailsView/components/report-export-component';
import { fluentLeftNavAutomationId } from 'electron/views/left-nav/fluent-left-nav';
import { leftNavAutomationId } from 'electron/views/left-nav/left-nav';
import {
    commandButtonRefreshId,
    commandButtonSettingsId,
} from 'electron/views/results/components/reflow-command-bar';
import { resultsViewAutomationId } from 'electron/views/results/results-view';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';

export const ResultsViewSelectors = {
    mainContainer: getAutomationIdSelector(resultsViewAutomationId),
    leftNav: getAutomationIdSelector(leftNavAutomationId),
    fluentLeftNav: getAutomationIdSelector(fluentLeftNavAutomationId),
    leftNavHamburgerButton: getAutomationIdSelector(leftNavHamburgerButtonAutomationId),
    exportReportButton: getAutomationIdSelector(exportReportCommandBarButtonId),

    nthTestInLeftNav: (position: number) =>
        `${getAutomationIdSelector(
            leftNavAutomationId,
        )} li:nth-of-type(${position}) ${getAutomationIdSelector(testViewLeftNavLinkAutomationId)}`,

    settingsButton: getAutomationIdSelector(commandButtonSettingsId),
    startOverButton: getAutomationIdSelector(commandButtonRefreshId),
};
