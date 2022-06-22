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
    let globalScopeFunctionMock: IMock<(...any) => void>;
    let loggingFunctionMock: IMock<(message: string, error: Error) => void>;
    let globalThisStub: typeof globalThis;
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
        globalScopeFunctionMock = Mock.ofType<(...any) => void>();
        globalScopeFunctionMock.setup(f => f(It.isAny())).verifiable(Times.never());
        loggingFunctionMock = Mock.ofType<(message: string, error: Error) => void>();
        globalThisStub = {
            onerror: globalScopeFunctionMock.object,
            onunhandledrejection: globalScopeFunctionMock.object,
        } as typeof globalThis;
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
        globalScopeFunctionMock.verifyAll();
        loggingFunctionMock.verifyAll();
        telemetrySanitizerMock.verifyAll();
    });

    describe('it sends telemetry', () => {
        test('globalThis on error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.WindowError,
                source: exceptionSource,
            };

            testSubject.initialize(loggerStub, globalThisStub, consoleStub);

            globalThisStub.onerror(errorMessageStub, '', 0, 0, errorStub);

            expect(publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('globalThis on unhandled rejection sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: undefined,
                errorType: ErrorType.UnhandledRejection,
                source: exceptionSource,
            };

            testSubject.initialize(loggerStub, globalThisStub, consoleStub);

            // Using .bind() fixes a typing error that doesn't affect the actual code
            globalThisStub.onunhandledrejection.bind(globalThis)(rejectedPromiseStub);

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

            testSubject.initialize(loggerStub, globalThisStub, consoleStub);

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

            testSubject.initialize(loggerStub, globalThisStub, consoleStub);

            loggerStub.error(errorMessageStub, errorStub);

            expect(publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });
    });
});
