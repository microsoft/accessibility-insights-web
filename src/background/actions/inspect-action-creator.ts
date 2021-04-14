// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { CHANGE_INSPECT_MODE } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { getStoreStateMessage, Messages } from 'common/messages';
import { StoreNames } from 'common/stores/store-names';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { InspectActions, InspectPayload } from './inspect-actions';

export class InspectActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly inspectActions: InspectActions,
        private readonly telemetryEventHandler: TelemetryEventHandler,
        private readonly browserAdapter: BrowserAdapter,
        private readonly logger: Logger,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Inspect.ChangeInspectMode,
            this.onChangeInspectMode,
        );
        this.interpreter.registerTypeToPayloadCallback(
            getStoreStateMessage(StoreNames.InspectStore),
            this.onGetInspectCurrentState,
        );
    }

    private onChangeInspectMode = async (payload: InspectPayload, tabId: number): Promise<void> => {
        this.telemetryEventHandler.publishTelemetry(CHANGE_INSPECT_MODE, payload);
        await this.browserAdapter
            .switchToTab(tabId)
            .catch(error => this.logger.error(`switchToTab failed: ${error}`));
        this.inspectActions.changeInspectMode.invoke(payload);
    };

    private onGetInspectCurrentState = (): void => {
        this.inspectActions.getCurrentState.invoke();
    };
}
