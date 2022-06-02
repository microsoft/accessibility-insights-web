// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { escapeRegExp } from 'lodash';
import * as TelemetryEvents from '../../common/extension-telemetry-events';
import { UnhandledErrorTelemetryData } from '../../common/extension-telemetry-events';

export abstract class ExceptionTelemetryListener {
    private readonly MAX_MESSAGE_CHARS = 300;
    private readonly MAX_STACK_CHARS = 5000;
    private readonly EXCLUDED_PROPERTIES = [
        'http',
        'html',
        'target',
        'url',
        'path',
        'snippet',
        'selector',
        'elementSelector',
        'cssSelector',
    ];

    constructor(private readonly exceptionSource: TelemetryEvents.TelemetryEventSource) {}

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
                sendExceptionTelemetry(
                    TelemetryEvents.ErrorType.WindowError,
                    message,
                    error?.stack,
                );
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
                sendExceptionTelemetry(TelemetryEvents.ErrorType.UnhandledRejection, event.reason);
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
            source,
            errorType,
        };

        telemetry.source = telemetry.source ? telemetry.source : this.exceptionSource;

        const sanitizedTelemetry = this.sanitizeTelemetryData(telemetry);

        if (sanitizedTelemetry) {
            this.publishErrorTelemetry(sanitizedTelemetry);
        }
    };

    private sanitizeTelemetryData = (
        telemetryData: UnhandledErrorTelemetryData,
    ): UnhandledErrorTelemetryData => {
        if (telemetryData.message && telemetryData.message.length > this.MAX_MESSAGE_CHARS) {
            telemetryData.message = telemetryData.message.substring(0, this.MAX_MESSAGE_CHARS);
        }
        if (telemetryData.stackTrace && telemetryData.stackTrace.length > this.MAX_STACK_CHARS) {
            telemetryData.stackTrace = telemetryData.stackTrace.substring(0, this.MAX_STACK_CHARS);
        }

        const exclusionRegex = this.generateExclusionRegex();
        if (
            (telemetryData.message && exclusionRegex.test(telemetryData.message)) ||
            (telemetryData.stackTrace && exclusionRegex.test(telemetryData.stackTrace))
        ) {
            return undefined;
        }
        return telemetryData;
    };

    private generateExclusionRegex(): RegExp {
        const urlPattern = ':\\/\\/';
        const questionablePropertyNamePattern =
            this.EXCLUDED_PROPERTIES.map(escapeRegExp).join('|');
        const questionablePropertyPattern = `['"](${questionablePropertyNamePattern})['"]`;
        const questionableSubstringPattern = `${urlPattern}|${questionablePropertyPattern}`;

        // This argument *is* a constant built from literals, it's just built up from parts
        // eslint-disable-next-line security/detect-non-literal-regexp
        return new RegExp(questionableSubstringPattern);
    }

    protected abstract publishErrorTelemetry: (telemetry: UnhandledErrorTelemetryData) => void;
}
