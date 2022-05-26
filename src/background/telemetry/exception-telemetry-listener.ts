// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from 'background/actions/action-payloads';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { Logger } from 'common/logging/logger';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { UnhandledExceptionTelemetryData } from '../../common/extension-telemetry-events';

enum ErrorType {
    WindowError = 'WindowError',
    UnhandledRejection = 'UnhandledRejection',
    ConsoleError = 'ConsoleError',
    LoggerError = 'LoggerError',
}

export class ExceptionTelemetryListener {
    private readonly MAX_MESSAGE_CHARS = 300;
    private readonly MAX_STACK_CHARS = 5000;

    constructor(private readonly telemetryEventHandler: TelemetryEventHandler) {}

    public initialize(
        logger: Logger,
        extWindow: Window = window,
        extConsole: Console = console,
    ): void {
        const sendExceptionTelemetry = this.sendExceptionTelemetry;
        let windowErrorHookIsActive = false;
        let windowRejectionHookIsActive = false;
        let consoleHookIsActive = false;
        let loggingHookIsActive = false;

        // Catch top level synchronous errors
        extWindow.onerror = function (
            message: string,
            source: string,
            lineno: number,
            colno: number,
            error: Error = null,
        ) {
            if (windowErrorHookIsActive) {
                return;
            }
            windowErrorHookIsActive = true;
            try {
                sendExceptionTelemetry(ErrorType.WindowError, message, error?.stack, source);
                return false;
            } finally {
                windowErrorHookIsActive = false;
            }
        };

        // Catch errors thrown in promises
        extWindow.onunhandledrejection = function (event: PromiseRejectionEvent) {
            if (windowRejectionHookIsActive) {
                return;
            }
            windowRejectionHookIsActive = true;
            try {
                sendExceptionTelemetry(ErrorType.UnhandledRejection, event.reason);
                return false;
            } finally {
                windowRejectionHookIsActive = false;
            }
        };

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
                    sendExceptionTelemetry(ErrorType.ConsoleError, message, err?.stack);
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
                    sendExceptionTelemetry(ErrorType.LoggerError, message, err?.stack);
                }

                if (optionalParams.length > 1) {
                    loggerError(message, ...optionalParams);
                } else {
                    loggerError(message, err);
                }
            } finally {
                loggingHookIsActive = false;
            }
        };
    }

    private sendExceptionTelemetry = (
        errorType: string,
        message: string,
        stackTrace?: string,
        source?: string,
    ): void => {
        const telemetry: UnhandledExceptionTelemetryData = {
            message,
            stackTrace,
            source,
            errorType,
        };
        const sanitizedTelemetry = this.sanitizeTelemetryData(telemetry);

        if (sanitizedTelemetry) {
            const payload: BaseActionPayload = {
                telemetry: sanitizedTelemetry,
            };

            this.telemetryEventHandler.publishTelemetry(
                TelemetryEvents.UNHANDLED_EXCEPTION,
                payload,
            );
        }
    };

    private sanitizeTelemetryData = (
        telemetryData: UnhandledExceptionTelemetryData,
    ): UnhandledExceptionTelemetryData => {
        if (telemetryData.message && telemetryData.message.length > this.MAX_MESSAGE_CHARS) {
            telemetryData.message = telemetryData.message.substring(0, this.MAX_MESSAGE_CHARS);
        }
        if (telemetryData.stackTrace && telemetryData.stackTrace.length > this.MAX_STACK_CHARS) {
            telemetryData.stackTrace = telemetryData.stackTrace.substring(0, this.MAX_STACK_CHARS);
        }
        if (telemetryData.message?.includes('http') || telemetryData.stackTrace?.includes('http')) {
            return undefined;
        }
        return telemetryData;
    };
}
