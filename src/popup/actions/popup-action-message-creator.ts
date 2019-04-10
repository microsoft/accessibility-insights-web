// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { BaseActionPayload, OnDetailsViewOpenPayload, SetLaunchPanelState } from '../../background/actions/action-payloads';
import { Message } from '../../common/message';
import { BaseActionMessageCreator } from '../../common/message-creators/base-action-message-creator';
import { Messages } from '../../common/messages';
import { SupportedMouseEvent, TelemetryDataFactory } from '../../common/telemetry-data-factory';
import * as TelemetryEvents from '../../common/telemetry-events';
import { TelemetryEventSource } from '../../common/telemetry-events';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { WindowUtils } from '../../common/window-utils';
import { LaunchPanelType } from '../components/popup-view';

const visualizationMessages = Messages.Visualizations;

export class PopupActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;
    private windowUtils: WindowUtils;

    constructor(postMessage: (message: Message) => void, tabId: number, telemetryFactory: TelemetryDataFactory, windowUtils?: WindowUtils) {
        super(postMessage, tabId);
        this.telemetryFactory = telemetryFactory;
        this.windowUtils = windowUtils || new WindowUtils();
    }

    public openTutorial(event: React.MouseEvent<HTMLElement>): void {
        this.sendTelemetry(TelemetryEvents.TUTORIAL_OPEN, this.telemetryFactory.fromLaunchPad(event));
    }

    public popupInitialized(): void {
        this.sendTelemetry(TelemetryEvents.POPUP_INITIALIZED, {
            source: TelemetryEventSource.LaunchPad,
            triggeredBy: 'N/A',
        });
    }

    public openLaunchPad(panelType: LaunchPanelType): void {
        this.sendTelemetry(TelemetryEvents.LAUNCH_PANEL_OPEN, {
            source: TelemetryEventSource.LaunchPad,
            triggeredBy: 'N/A',
            launchPanelType: panelType,
        });
    }

    public openDetailsView(
        event: SupportedMouseEvent,
        viewType: VisualizationType,
        source: TelemetryEventSource,
        pivotType = DetailsViewPivotType.allTest,
    ): void {
        const payload: OnDetailsViewOpenPayload = {
            telemetry: this.telemetryFactory.forOpenDetailsView(event, viewType, source),
            detailsViewType: viewType,
            pivotType: pivotType,
        };

        this.dispatchMessage({
            type: visualizationMessages.DetailsView.Open,
            tabId: this._tabId,
            payload: payload,
        });

        this.windowUtils.closeWindow();
    }

    public openShortcutConfigureTab(event: SupportedMouseEvent): void {
        const telemetry = this.telemetryFactory.fromHamburgerMenu(event);
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: Messages.ChromeFeature.configureCommand,
            tabId: this._tabId,
            payload,
        });
    }

    public setLaunchPanelType(panelType: LaunchPanelType): void {
        const payload: SetLaunchPanelState = {
            launchPanelType: panelType,
        };
        this.dispatchMessage({
            type: Messages.LaunchPanel.Set,
            tabId: this._tabId,
            payload,
        });
    }
}
