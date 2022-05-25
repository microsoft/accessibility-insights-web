// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { UnhandledExceptionTelemetryData } from '../../common/extension-telemetry-events';

export class ExceptionTelemetryListener {
    constructor(private readonly telemetryEventHandler: TelemetryEventHandler) {}

    public initialize(logger: Logger): void {
        const sendExceptionTelemetry = (message: string, stackTrace?: string): void => {
            const telemetry: UnhandledExceptionTelemetryData = { message, stackTrace };
            const payload: BaseActionPayload = {
                telemetry,
            };

            this.telemetryEventHandler.publishTelemetry(
                TelemetryEvents.UNHANDLED_EXCEPTION,
                payload,
            );
        };

        // Catch top level synchronous errors
        window.onerror = function (
            message: string,
            source: string,
            lineno: number,
            colno: number,
            error: Error = null,
        ) {
            sendExceptionTelemetry(message, error?.stack);
            return false;
        };

        // Catch errors thrown in promises
        window.onunhandledrejection = function (event: PromiseRejectionEvent) {
            sendExceptionTelemetry(event.reason);
            return false;
        };

        // Catch errors written to console.error
        var consoleError = console.error;
        console.error = function (message?: any, ...optionalParams: any[]) {
            const err = optionalParams[0] as Error;
            if (message || err) {
                sendExceptionTelemetry(message, err?.stack);
            }

            consoleError(message, ...optionalParams);
        };

        // Catch errors written to logger.error
        var loggerError = logger.error;
        logger.error = function (message?: any, ...optionalParams: any[]) {
            const err = optionalParams[0] as Error;
            if (message || err) {
                sendExceptionTelemetry(message, err?.stack);
            }

            loggerError(message, ...optionalParams);
        };
    }
}
