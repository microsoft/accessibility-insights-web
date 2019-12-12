// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DiagnosticViewClickHandler } from './diagnostic-view-toggle-click-handler';
import { LaunchPanelHeaderClickHandler } from './feedback-menu-click-handler';
import { PopupViewControllerHandler } from './popup-view-controller-handler';

export interface IPopupHandlers {
    diagnosticViewClickHandler: DiagnosticViewClickHandler;
    popupViewControllerHandler: PopupViewControllerHandler;
    launchPanelHeaderClickHandler: LaunchPanelHeaderClickHandler;
    supportLinkHandler?: SupportLinkHandler;
}
