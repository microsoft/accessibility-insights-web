// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    ErrorType,
    TelemetryEventSource,
    UnhandledErrorTelemetryData,
} from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { ExceptionTelemetryListener } from 'common/telemetry/exception-telemetry-listener';
import { IMock, It, Mock, Times } from 'typemoq';

class TestExtensionTelemetryListener extends ExceptionTelemetryListener {
    public publishExceptionTelemetryCalls: UnhandledErrorTelemetryData[] = [];

    protected override publishErrorTelemetry = (telemetry: UnhandledErrorTelemetryData): void => {
        this.publishExceptionTelemetryCalls.push(telemetry);
    };
}

describe(ExceptionTelemetryListener, () => {
    const exceptionSource: TelemetryEventSource = TelemetryEventSource.AdHocTools;
    let windowFunctionMock: IMock<(...any) => void>;
    let loggingFunctionMock: IMock<(message: string, error: Error) => void>;
    let windowStub: Window;
    let consoleStub: Console;
    let loggerStub: Logger;

    let errorMessageStub: string;
    let errorStub: Error;
    let rejectedPromiseStub: PromiseRejectionEvent;
    let expectedTelemetry: UnhandledErrorTelemetryData;

    let testSubject: TestExtensionTelemetryListener;

    beforeEach(async () => {
        windowFunctionMock = Mock.ofType<(...any) => void>();
        windowFunctionMock.setup(f => f(It.isAny())).verifiable(Times.never());
        loggingFunctionMock = Mock.ofType<(message: string, error: Error) => void>();
        windowStub = {
            onerror: windowFunctionMock.object,
            onunhandledrejection: windowFunctionMock.object,
        } as Window;
        consoleStub = { error: loggingFunctionMock.object } as Console;
        loggerStub = { error: loggingFunctionMock.object } as Logger;

        errorMessageStub = 'Error message';
        errorStub = new Error();
        rejectedPromiseStub = { reason: errorMessageStub } as PromiseRejectionEvent;

        testSubject = new TestExtensionTelemetryListener(exceptionSource);
    });

    afterEach(() => {
        windowFunctionMock.verifyAll();
        loggingFunctionMock.verifyAll();
    });

    describe('it sends telemetry', () => {
        test('window on error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.WindowError,
                source: exceptionSource,
            };

            testSubject.initialize(loggerStub, windowStub, consoleStub);

            windowStub.onerror(errorMessageStub, '', 0, 0, errorStub);

            expect(testSubject.publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('window on unhandled rejection sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: undefined,
                errorType: ErrorType.UnhandledRejection,
                source: exceptionSource,
            };

            testSubject.initialize(loggerStub, windowStub, consoleStub);

            windowStub.onunhandledrejection(rejectedPromiseStub);

            expect(testSubject.publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('console error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.ConsoleError,
                source: exceptionSource,
            };

            loggingFunctionMock.setup(f => f(errorMessageStub, errorStub)).verifiable(Times.once());

            testSubject.initialize(loggerStub, windowStub, consoleStub);

            consoleStub.error(errorMessageStub, errorStub);

            expect(testSubject.publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });

        test('logger error sends telemetry', () => {
            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType: ErrorType.LoggerError,
                source: exceptionSource,
            };

            loggingFunctionMock.setup(f => f(errorMessageStub, errorStub)).verifiable(Times.once());

            testSubject.initialize(loggerStub, windowStub, consoleStub);

            loggerStub.error(errorMessageStub, errorStub);

            expect(testSubject.publishExceptionTelemetryCalls).toMatchObject([expectedTelemetry]);
        });
    });

    describe('it sanitizes telemetry', () => {
        describe('it truncates long data', () => {
            afterEach(() => {
                testSubject.initialize(loggerStub, windowStub, consoleStub);

                windowStub.onerror(errorMessageStub, '', 0, 0, errorStub);

                expect(testSubject.publishExceptionTelemetryCalls).toMatchObject([
                    expectedTelemetry,
                ]);
            });

            test('it truncates messages beyond size cap', () => {
                errorMessageStub = 'very long message'.repeat(30);

                expectedTelemetry = {
                    message: errorMessageStub.substring(0, 300),
                    stackTrace: errorStub.stack,
                    errorType: ErrorType.WindowError,
                    source: exceptionSource,
                };
            });

            test('it truncates stack traces beyond size cap', () => {
                errorStub.stack = 'very long stack'.repeat(500);

                expectedTelemetry = {
                    message: errorMessageStub,
                    stackTrace: errorStub.stack.substring(0, 5000),
                    errorType: ErrorType.WindowError,
                    source: exceptionSource,
                };
            });
        });

        describe('it does not send invalid data', () => {
            afterEach(() => {
                testSubject.initialize(loggerStub, windowStub, consoleStub);

                windowStub.onerror(errorMessageStub, '', 0, 0, errorStub);

                expect(testSubject.publishExceptionTelemetryCalls).toMatchObject([]);
            });

            test('it does not send data that includes urls', () => {
                errorMessageStub = 'https://accessibilityinsights.io/';
            });

            test('it does not send data that includes html', () => {
                errorMessageStub = '"html"';
            });
        });
    });
});
