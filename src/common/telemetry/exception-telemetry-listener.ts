// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { UnhandledErrorTelemetryData } from '../../common/extension-telemetry-events';

export class ExceptionTelemetryListener {
    constructor(
        private readonly exceptionSource: TelemetryEvents.TelemetryEventSource,
        private readonly publishErrorTelemetry: (
            eventName: string,
            data: UnhandledErrorTelemetryData,
        ) => void,
        private readonly telemetrySanitizer: ExceptionTelemetrySanitizer,
    ) {}

    public initialize(
        logger: Logger,
        extGlobalScope: typeof globalThis = globalThis,
        extConsole: Console = console,
    ): void {
        const sendExceptionTelemetry = this.sendExceptionTelemetry;
        let windowErrorHookIsActive = false;
        let windowRejectionHookIsActive = false;
        let consoleHookIsActive = false;
        let loggingHookIsActive = false;

        // Catch top level synchronous errors
        extGlobalScope.addEventListener('error', function (event: ErrorEvent) {
            if (windowErrorHookIsActive) {
                return;
            }
            windowErrorHookIsActive = true;
            try {
                sendExceptionTelemetry(
                    TelemetryEvents.ErrorType.WindowError,
                    event.message,
                    event.error?.stack,
                );
                return false;
            } finally {
                windowErrorHookIsActive = false;
            }
        });

        // Catch errors thrown in promises
        extGlobalScope.addEventListener(
            'unhandledrejection',
            function (event: PromiseRejectionEvent) {
                if (windowRejectionHookIsActive) {
                    return;
                }
                windowRejectionHookIsActive = true;
                try {
                    sendExceptionTelemetry(
                        TelemetryEvents.ErrorType.UnhandledRejection,
                        event.reason,
                    );
                    return false;
                } finally {
                    windowRejectionHookIsActive = false;
                }
            },
        );

        // Catch errors written to console.error
        const consoleError = extConsole.error;
        extConsole.error = function (message?: any, ...optionalParams: any[]) {
            if (consoleHookIsActive) {
                return;
            }
            consoleHookIsActive = true;
            try {
                const err = optionalParams[0] as Error;
                if (message || err) {
                    sendExceptionTelemetry(
                        TelemetryEvents.ErrorType.ConsoleError,
                        message,
                        err?.stack,
                    );
                }

                if (optionalParams.length > 1) {
                    consoleError(message, ...optionalParams);
                } else {
                    consoleError(message, err);
                }
            } finally {
                consoleHookIsActive = false;
            }
        };

        // Catch errors written to logger.error
        // Note that this is separate from console.error (despite the default logger deferring to
        // console.error) because we generated the default logger before updating console.error
        // above, meaning logger.error still has the old console.error implementation.
        const loggerError = logger.error;
        logger.error = function (message?: any, ...optionalParams: any[]) {
            if (loggingHookIsActive) {
                return;
            }
            loggingHookIsActive = true;
            try {
                const err = optionalParams[0] as Error;
                if (message || err) {
                    sendExceptionTelemetry(
                        TelemetryEvents.ErrorType.LoggerError,
                        message ?? err.message,
                        err?.stack,
                    );
                }

                if (optionalParams.length > 1) {
                    loggerError(message ?? err.message, ...optionalParams);
                } else {
                    loggerError(message ?? err.message, err);
                }
            } finally {
                loggingHookIsActive = false;
            }
        };
    }

    private sendExceptionTelemetry = (
        errorType: TelemetryEvents.ErrorType,
        message: string,
        stackTrace?: string,
        source?: TelemetryEvents.TelemetryEventSource,
    ): void => {
        const telemetry: UnhandledErrorTelemetryData = {
            message: message.toString(),
            stackTrace,
            source: source ? source : this.exceptionSource,
            errorType,
        };

        const sanitizedTelemetry = this.telemetrySanitizer.sanitizeTelemetryData(telemetry);

        if (sanitizedTelemetry) {
            this.publishErrorTelemetry(TelemetryEvents.UNHANDLED_ERROR, sanitizedTelemetry);
        }
    };
}
