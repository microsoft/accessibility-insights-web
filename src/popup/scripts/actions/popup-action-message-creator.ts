// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BaseActionPayload, OnDetailsViewOpenPayload, SetLaunchPanelState } from '../../../background/actions/action-payloads';
import { BaseActionMessageCreator } from '../../../common/message-creators/base-action-message-creator';
import { Messages } from '../../../common/messages';
import { TelemetryDataFactory } from '../../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../../common/telemetry-events';
import * as TelemetryEvents from '../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../../common/types/visualization-type';
import { WindowUtils } from '../../../common/window-utils';
import { LaunchPanelType } from '../components/popup-view';

const visualizationMessages = Messages.Visualizations;

export class PopupActionMessageCreator extends BaseActionMessageCreator {
    private telemetryFactory: TelemetryDataFactory;
    private windowUtils: WindowUtils;

    constructor(
        postMessage: (message: IMessage) => void,
        tabId: number,
        telemetryFactory: TelemetryDataFactory,
        windowUtils?: WindowUtils,
    ) {
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
        event: React.SyntheticEvent<MouseEvent> | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
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

    public openShortcutConfigureTab(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>): void {
        const telemetry = this.telemetryFactory.fromHamburgetMenu(event);
        const payload: BaseActionPayload = {
            telemetry,
        };
        this.dispatchMessage({
            type: Messages.ChromeFeature.configureCommand,
            tabId: this._tabId,
            payload,
        });
    }

    public setLaunchPanelType(type: LaunchPanelType): void {
        const payload: SetLaunchPanelState = {
            launchPanelType: type,
        };
        this.dispatchMessage({
            type: Messages.LaunchPanel.Set,
            tabId: this._tabId,
            payload,
        });
    }
}
