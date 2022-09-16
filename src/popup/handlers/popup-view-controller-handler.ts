// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import { PopupView } from '../components/popup-view';

export class PopupViewControllerHandler {
    public openLaunchPad(component: PopupView): void {
        this.triggerRerender(component, LaunchPanelType.LaunchPad);
    }

    public openAdhocToolsPanel(component: PopupView): void {
        this.triggerRerender(component, LaunchPanelType.AdhocToolsPanel);
    }

    public triggerRerender(component: PopupView, panelType: LaunchPanelType): void {}
}
