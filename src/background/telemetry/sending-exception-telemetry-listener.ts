// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { ExceptionTelemetryListener } from 'background/telemetry/exception-telemetry-listener';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import * as TelemetryEvents from '../../common/extension-telemetry-events';

export class SendingExceptionTelemetryListener extends ExceptionTelemetryListener {
    constructor(
        private readonly telemetryEventHandler: TelemetryEventHandler,
        exceptionSource: TelemetryEvents.TelemetryEventSource,
    ) {
        super(exceptionSource);
    }

    protected override publishErrorTelemetry = (
        telemetry: TelemetryEvents.UnhandledErrorTelemetryData,
    ): void => {
        const payload: BaseActionPayload = {
            telemetry,
        };

        this.telemetryEventHandler.publishTelemetry(TelemetryEvents.UNHANDLED_ERROR, payload);
    };
}
