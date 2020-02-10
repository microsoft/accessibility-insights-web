// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DiagnosticViewClickHandler } from './diagnostic-view-toggle-click-handler';
import { LaunchPanelHeaderClickHandler } from './launch-panel-header-click-handler';
import { PopupViewControllerHandler } from './popup-view-controller-handler';

export interface PopupHandlers {
    diagnosticViewClickHandler: DiagnosticViewClickHandler;
    popupViewControllerHandler: PopupViewControllerHandler;
    launchPanelHeaderClickHandler: LaunchPanelHeaderClickHandler;
}
