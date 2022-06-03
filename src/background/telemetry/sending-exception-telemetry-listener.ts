// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import * as TelemetryEvents from '../../common/extension-telemetry-events';

export class SendingExceptionTelemetryListener extends ExceptionTelemetryListener {
    constructor(
        private readonly telemetryEventHandler: TelemetryEventHandler,
        exceptionSource: TelemetryEvents.TelemetryEventSource,
        telemetrySanitizer: ExceptionTelemetrySanitizer,
    ) {
        const publishTelemetry = (
            eventName: string,
            telemetry: TelemetryEvents.UnhandledErrorTelemetryData,
        ): void => {
            const payload: BaseActionPayload = {
                telemetry,
            };

            this.telemetryEventHandler.publishTelemetry(eventName, payload);
        };

        super(exceptionSource, publishTelemetry, telemetrySanitizer);
    }
}
