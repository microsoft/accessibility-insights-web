// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExceptionTelemetryListener } from 'background/telemetry/exception-telemetry-listener';
import { RemoteActionMessageDispatcher } from 'common/message-creators/remote-action-message-dispatcher';
import * as TelemetryEvents from '../../common/extension-telemetry-events';

export class ForwardingExceptionTelemetryListener extends ExceptionTelemetryListener {
    constructor(
        private readonly actionMessageDispatcher: RemoteActionMessageDispatcher,
        exceptionSource: TelemetryEvents.TelemetryEventSource,
    ) {
        super(exceptionSource);
    }

    protected override publishErrorTelemetry = (
        telemetry: TelemetryEvents.UnhandledErrorTelemetryData,
    ): void => {
        this.actionMessageDispatcher.sendTelemetry(TelemetryEvents.UNHANDLED_ERROR, telemetry);
    };
}
