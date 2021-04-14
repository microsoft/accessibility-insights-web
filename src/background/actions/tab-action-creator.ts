// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { EXISTING_TAB_URL_UPDATED, SWITCH_BACK_TO_TARGET } from 'common/extension-telemetry-events';
import { Tab } from 'common/itab';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import {
    ExistingTabUpdatedPayload,
    PageVisibilityChangeTabPayload,
    SwitchToTargetTabPayload,
} from './action-payloads';
import { TabActions } from './tab-actions';

export class TabActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly tabActions: TabActions,
        private readonly browserAdapter: BrowserAdapter,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly logger: Logger,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Tab.NewTabCreated, (payload: Tab) =>
            this.tabActions.newTabCreated.invoke(payload),
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.TabStore),
            () => this.tabActions.getCurrentState.invoke(null),
        );
        this.interpreter.registerTypeToPayloadCallback(Messages.Tab.Remove, () =>
            this.tabActions.tabRemove.invoke(null),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Tab.ExistingTabUpdated,
            this.onExistingTabUpdated,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Tab.Switch,
            this.onSwitchToTargetTab,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Tab.VisibilityChange,
            (payload: PageVisibilityChangeTabPayload) =>
                this.tabActions.tabVisibilityChange.invoke(payload.hidden),
        );
    }

    private onSwitchToTargetTab = async (
        payload: SwitchToTargetTabPayload,
        tabId: number,
    ): Promise<void> => {
        await this.browserAdapter
            .switchToTab(tabId)
            .catch(error => this.logger.error(`switchToTab failed: ${error}`));
        this.telemetryEventHandler.publishTelemetry(SWITCH_BACK_TO_TARGET, payload);
    };

    private onExistingTabUpdated = (payload: ExistingTabUpdatedPayload): void => {
        this.tabActions.existingTabUpdated.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(EXISTING_TAB_URL_UPDATED, payload);
    };
}
