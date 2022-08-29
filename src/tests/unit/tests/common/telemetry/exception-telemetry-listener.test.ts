// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    ErrorType,
    TelemetryEventSource,
    UnhandledErrorTelemetryData,
} from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';
import { IMock, It, Mock, Times } from 'typemoq';

describe(ExceptionTelemetryListener, () => {
    const exceptionSource: TelemetryEventSource = TelemetryEventSource.AdHocTools;
    let telemetrySanitizerMock: IMock<ExceptionTelemetrySanitizer>;
    let loggingFunctionMock: IMock<(message: string, error: Error) => void>;
    let globalThisMock: IMock<typeof globalThis>;
    let onErrorCallback: (event: ErrorEvent) => void;
    let onRejectedCallback: (event: PromiseRejectionEvent) => void;
    let consoleStub: Console;
    let loggerStub: Logger;

    let errorMessageStub: string;
    let errorStub: Error;
    let rejectedPromiseStub: PromiseRejectionEvent;
    let expectedTelemetry: UnhandledErrorTelemetryData;
    let publishExceptionTelemetryCalls: UnhandledErrorTelemetryData[];
    let publishErrorTelemetry: (eventName: string, data: UnhandledErrorTelemetryData) => void;

    let testSubject: ExceptionTelemetryListener;

    beforeEach(async () => {
        telemetrySanitizerMock = Mock.ofType<ExceptionTelemetrySanitizer>();
        telemetrySanitizerMock
            .setup(m => m.sanitizeTelemetryData(It.isAny()))
            .returns(t => t)
            .verifiable(Times.once());
        loggingFunctionMock = Mock.ofType<(message: string, error: Error) => void>();
        globalThisMock = Mock.ofType<typeof globalThis>();
        globalThisMock
            .setup(m => m.addEventListener('error', It.isAny()))
            .callback((_, callback) => {
                onErrorCallback = callback;
            })
            .verifiable(Times.once());
        globalThisMock
            .setup(m => m.addEventListener('unhandledrejection', It.isAny()))
            .callback((_, callback) => {
                onRejectedCallback = callback;
            })
            .verifiable(Times.once());
        consoleStub = { error: loggingFunctionMock.object } as Console;
        loggerStub = { error: loggingFunctionMock.object } as Logger;

        errorMessageStub = 'Error message';
        errorStub = new Error();
        rejectedPromiseStub = { reason: errorMessageStub } as PromiseRejectionEvent;
        publishExceptionTelemetryCalls = [];
        publishErrorTelemetry = (
            eventType: string,
            telemetry: UnhandledErrorTelemetryData,
        ): void => {
            publishExceptionTelemetryCalls.push(telemetry);
        };

        testSubject = new ExceptionTelemetryListener(
            exceptionSource,
            publishErrorTelemetry,
            telemetrySanitizerMock.object,
        );
    });

    afterEach(() => {
        loggingFunctionMock.verifyAll();
        telemetrySanitizerMock.verifyAll();
        globalThisMock.verifyAll();
    });

    describe('it sends telemetry', () => {
        test('globalThis on error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.WindowError,
                source: exceptionSource,
            };

            testSubject.initialize(loggerStub, globalThisMock.object, consoleStub);

            onErrorCallback({ message: errorMessageStub, error: errorStub } as ErrorEvent);

            expect(publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('globalThis on unhandled rejection sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: undefined,
                errorType: ErrorType.UnhandledRejection,
                source: exceptionSource,
            };

            testSubject.initialize(loggerStub, globalThisMock.object, consoleStub);

            onRejectedCallback(rejectedPromiseStub);

            expect(publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('console error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.ConsoleError,
                source: exceptionSource,
            };

            loggingFunctionMock.setup(f => f(errorMessageStub, errorStub)).verifiable(Times.once());

            testSubject.initialize(loggerStub, globalThisMock.object, consoleStub);

            consoleStub.error(errorMessageStub, errorStub);

            expect(publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('logger error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.LoggerError,
                source: exceptionSource,
            };

            loggingFunctionMock.setup(f => f(errorMessageStub, errorStub)).verifiable(Times.once());

            testSubject.initialize(loggerStub, globalThisMock.object, consoleStub);

            loggerStub.error(errorMessageStub, errorStub);

            expect(publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });
    });
});
