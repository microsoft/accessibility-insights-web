// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { DetailsViewController } from 'background/details-view-controller';
import { SidePanel } from 'background/stores/side-panel';
import {
    PREVIEW_FEATURES_OPEN,
    PREVIEW_FEATURES_CLOSE,
    SCOPING_CLOSE,
    SCOPING_OPEN,
    SETTINGS_PANEL_CLOSE,
    SETTINGS_PANEL_OPEN,
} from 'common/extension-telemetry-events';
import { createDefaultLogger } from 'common/logging/default-logger';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';
import { DetailsViewActions } from './details-view-actions';

type SidePanelToTelemetryEventName = {
    [P in SidePanel]: string;
};

export class DetailsViewActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly detailsViewActions: DetailsViewActions,
        private readonly sidePanelActions: SidePanelActions,
        private readonly detailsViewController: DetailsViewController,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly logger: Logger = createDefaultLogger(),
    ) {}

    public registerCallback(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.SettingsPanel.OpenPanel,
            this.onOpenSidePanel.bind(this, 'Settings'),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.PreviewFeatures.OpenPanel,
            this.onOpenSidePanel.bind(this, 'PreviewFeatures'),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Scoping.OpenPanel,
            this.onOpenSidePanel.bind(this, 'Scoping'),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.SettingsPanel.ClosePanel,
            this.onCloseSidePanel.bind(this, 'Settings'),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.PreviewFeatures.ClosePanel,
            this.onCloseSidePanel.bind(this, 'PreviewFeatures'),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Scoping.ClosePanel,
            this.onCloseSidePanel.bind(this, 'Scoping'),
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.DetailsViewStore),
            this.onGetDetailsViewCurrentState,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Visualizations.DetailsView.SetDetailsViewRightContentPanel,
            this.onSetDetailsViewRightContentPanel,
        );
    }

    private sidePanelToOpenPanelTelemetryEventName: SidePanelToTelemetryEventName = {
        Settings: SETTINGS_PANEL_OPEN,
        PreviewFeatures: PREVIEW_FEATURES_OPEN,
        Scoping: SCOPING_OPEN,
    };

    private onOpenSidePanel = async (
        panel: SidePanel,
        payload: BaseActionPayload,
        tabId: number,
    ): Promise<void> => {
        this.sidePanelActions.openSidePanel.invoke(panel);
        await this.detailsViewController.showDetailsView(tabId).catch(this.logger.error);

        const eventName = this.sidePanelToOpenPanelTelemetryEventName[panel];
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    };

    private sidePanelToClosePanelTelemetryEventName: SidePanelToTelemetryEventName = {
        Settings: SETTINGS_PANEL_CLOSE,
        PreviewFeatures: PREVIEW_FEATURES_CLOSE,
        Scoping: SCOPING_CLOSE,
    };

    private onCloseSidePanel = (panel: SidePanel, payload: BaseActionPayload): void => {
        this.sidePanelActions.closeSidePanel.invoke(panel);

        const eventName = this.sidePanelToClosePanelTelemetryEventName[panel];
        this.telemetryEventHandler.publishTelemetry(eventName, payload);
    };

    private onSetDetailsViewRightContentPanel = (
        payload: DetailsViewRightContentPanelType,
    ): void => {
        this.detailsViewActions.setSelectedDetailsViewRightContentPanel.invoke(payload);
    };

    private onGetDetailsViewCurrentState = (): void => {
        this.detailsViewActions.getCurrentState.invoke(null);
    };
}
