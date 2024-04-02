// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    BaseActionPayload,
    OnDetailsViewOpenPayload,
    SetLaunchPanelState,
} from 'background/actions/action-payloads';
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Tab } from 'common/types/store-data/itab';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import * as React from 'react';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { TelemetryEventSource } from '../../common/extension-telemetry-events';
import { Messages } from '../../common/messages';
import { SupportedMouseEvent, TelemetryDataFactory } from '../../common/telemetry-data-factory';
import { DetailsViewPivotType } from '../../common/types/store-data/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { WindowUtils } from '../../common/window-utils';

const visualizationMessages = Messages.Visualizations;

export class PopupActionMessageCreator {
    constructor(
        private readonly telemetryFactory: TelemetryDataFactory,
        private readonly dispatcher: ActionMessageDispatcher,
        private readonly windowUtils: WindowUtils,
    ) {}

    public openTutorial(event: React.MouseEvent<HTMLElement>): void {
        this.dispatcher.sendTelemetry(
            TelemetryEvents.TUTORIAL_OPEN,
            this.telemetryFactory.fromLaunchPad(event),
        );
    }

    public popupInitialized(tab: Tab): void {
        const payload = {
            telemetry: {
                source: TelemetryEventSource.LaunchPad,
                triggeredBy: 'N/A',
            },
            tab,
        };

        this.dispatcher.dispatchMessage({
            messageType: Messages.Popup.Initialized,
            payload: payload,
        });
    }

    public openLaunchPad(panelType: LaunchPanelType): void {
        this.dispatcher.sendTelemetry(TelemetryEvents.LAUNCH_PANEL_OPEN, {
            source: TelemetryEventSource.LaunchPad,
            triggeredBy: 'N/A',
            launchPanelType: panelType,
        });
    }

    public async openDetailsView(
        event: SupportedMouseEvent,
        viewType: VisualizationType | null,
        source: TelemetryEventSource,
        pivotType: DetailsViewPivotType,
    ): Promise<void> {
        const payload: OnDetailsViewOpenPayload = {
            telemetry: this.telemetryFactory.forOpenDetailsView(event, viewType, source),
            detailsViewType: viewType,
            pivotType: pivotType,
        };

        await this.dispatcher.asyncDispatchMessage({
            messageType: visualizationMessages.DetailsView.Open,
            payload: payload,
        });

        this.windowUtils.closeWindow();
    }

    public openShortcutConfigureTab(event: SupportedMouseEvent): void {
        const telemetry = this.telemetryFactory.fromHamburgerMenu(event);
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatcher.dispatchMessage({
            messageType: Messages.Shortcuts.ConfigureShortcuts,
            payload,
        });
    }

    public setLaunchPanelType(panelType: LaunchPanelType): void {
        const payload: SetLaunchPanelState = {
            launchPanelType: panelType,
        };
        this.dispatcher.dispatchMessage({
            messageType: Messages.LaunchPanel.Set,
            payload,
        });
    }
}
