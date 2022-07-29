// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { EXISTING_TAB_URL_UPDATED, SWITCH_BACK_TO_TARGET } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { Tab } from 'common/types/store-data/itab';
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
        private readonly tabId: number,
    ) {}

    /*
        Tab actions are often invoked in multiple tabs at the same time (ex: one tab becomes active,
        while another becomes in-active) but that is expected/desired. We include the tabId for the
        scope to ensure the scope-mutex does not throw an error in those scenarios.
    */
    private readonly scope = `TabActionCreator:${this.tabId}`;

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Tab.NewTabCreated,
            async (payload: Tab) => await this.tabActions.newTabCreated.invoke(payload),
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.TabStore),
            async () => await this.tabActions.getCurrentState.invoke(null),
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Tab.Remove,
            async (_, tabId: number) => await this.tabActions.tabRemove.invoke(null, this.scope),
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
            async (payload: PageVisibilityChangeTabPayload, tabId) => {
                await this.tabActions.tabVisibilityChange.invoke(payload.hidden, this.scope);
            },
        );
    }

    private onSwitchToTargetTab = async (
        payload: SwitchToTargetTabPayload,
        tabId: number,
    ): Promise<void> => {
        await this.browserAdapter
            .switchToTab(tabId)
            .catch(error => this.logger.error(`switchToTab failed: ${error}`, error));
        this.telemetryEventHandler.publishTelemetry(SWITCH_BACK_TO_TARGET, payload);
    };

    private onExistingTabUpdated = async (payload: ExistingTabUpdatedPayload) => {
        await this.tabActions.existingTabUpdated.invoke(payload);
        this.telemetryEventHandler.publishTelemetry(EXISTING_TAB_URL_UPDATED, payload);
    };
}
