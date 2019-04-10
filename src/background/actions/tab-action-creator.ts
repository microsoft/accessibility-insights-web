// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RegisterTypeToPayloadCallback } from '../../common/message';
import { Messages } from '../../common/messages';
import { SWITCH_BACK_TO_TARGET } from '../../common/telemetry-events';
import { BrowserAdapter } from '../browser-adapter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { SwitchToTargetTabPayload } from './action-payloads';
import { TabActions } from './tab-actions';

export class TabActionCreator {
    private tabActions: TabActions;
    private registerTypeToPayloadCallback: RegisterTypeToPayloadCallback;
    private browserAdapter: BrowserAdapter;
    private telemetryEventHandler: TelemetryEventHandler;

    constructor(
        registerTypeToPayloadCallback: RegisterTypeToPayloadCallback,
        browserAdapter: BrowserAdapter,
        telemetryEventHandler: TelemetryEventHandler,
        tabActions: TabActions,
    ) {
        this.registerTypeToPayloadCallback = registerTypeToPayloadCallback;
        this.browserAdapter = browserAdapter;
        this.telemetryEventHandler = telemetryEventHandler;
        this.tabActions = tabActions;
    }

    public registerCallbacks(): void {
        this.registerTypeToPayloadCallback(Messages.Tab.Update, payload => this.tabActions.tabUpdate.invoke(payload));
        this.registerTypeToPayloadCallback(Messages.Tab.GetCurrent, () => this.tabActions.getCurrentState.invoke(null));
        this.registerTypeToPayloadCallback(Messages.Tab.Remove, () => this.tabActions.tabRemove.invoke(null));
        this.registerTypeToPayloadCallback(Messages.Tab.Change, payload => this.tabActions.tabChange.invoke(payload));
        this.registerTypeToPayloadCallback(Messages.Tab.Switch, (payload, tabId) => this.onSwitchToTargetTab(payload, tabId));
        this.registerTypeToPayloadCallback(Messages.Tab.VisibilityChange, payload =>
            this.tabActions.tabVisibilityChange.invoke(payload.hidden),
        );
    }

    private onSwitchToTargetTab(payload: SwitchToTargetTabPayload, tabId: number): void {
        this.browserAdapter.switchToTab(tabId);
        this.telemetryEventHandler.publishTelemetry(SWITCH_BACK_TO_TARGET, payload);
    }
}
