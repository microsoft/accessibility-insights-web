// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseActionPayload } from 'background/actions/action-payloads';
import { ExceptionTelemetryListener } from 'background/telemetry/exception-telemetry-listener';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { UnhandledExceptionTelemetryData } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
import { IMock, It, Mock, Times } from 'typemoq';

describe(ExceptionTelemetryListener, () => {
    const telemetryType: string = 'unhandledException';

    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;
    let windowFunctionMock: IMock<(...any) => void>;
    let loggingFunctionMock: IMock<(message: string, error: Error) => void>;
    let windowStub: Window;
    let consoleStub: Console;
    let loggerStub: Logger;

    let errorMessageStub: string;
    let errorStub: Error;
    let rejectedPromiseStub: PromiseRejectionEvent;
    let expectedTelemetry: UnhandledExceptionTelemetryData;
    let expectedPayload: BaseActionPayload;

    let testSubject: ExceptionTelemetryListener;

    beforeEach(async () => {
        telemetryEventHandlerMock = Mock.ofType<TelemetryEventHandler>();
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
        expectedTelemetry = {
            message: errorMessageStub,
            stackTrace: errorStub.stack,
        };
        expectedPayload = { telemetry: expectedTelemetry };

        testSubject = new ExceptionTelemetryListener(telemetryEventHandlerMock.object);
    });

    afterEach(() => {
        telemetryEventHandlerMock.verifyAll();
        windowFunctionMock.verifyAll();
        loggingFunctionMock.verifyAll();
    });

    test('window on error sends telemetry', () => {
        telemetryEventHandlerMock
            .setup(t => t.publishTelemetry(telemetryType, expectedPayload))
            .verifiable(Times.once());

        testSubject.initialize(loggerStub, windowStub, consoleStub);

        windowStub.onerror(errorMessageStub, '', 0, 0, errorStub);
    });

    test('window on unhandled rejection sends telemetry', () => {
        expectedTelemetry = {
            message: errorMessageStub,
            stackTrace: undefined,
        };
        expectedPayload = { telemetry: expectedTelemetry };

        telemetryEventHandlerMock
            .setup(t => t.publishTelemetry(telemetryType, expectedPayload))
            .verifiable(Times.once());

        testSubject.initialize(loggerStub, windowStub, consoleStub);

        windowStub.onunhandledrejection(rejectedPromiseStub);
    });

    test('console error sends telemetry', () => {
        telemetryEventHandlerMock
            .setup(t => t.publishTelemetry(telemetryType, expectedPayload))
            .verifiable(Times.once());

        loggingFunctionMock.setup(f => f(errorMessageStub, errorStub)).verifiable(Times.once());

        testSubject.initialize(loggerStub, windowStub, consoleStub);

        consoleStub.error(errorMessageStub, errorStub);
    });

    test('logger error sends telemetry', () => {
        telemetryEventHandlerMock
            .setup(t => t.publishTelemetry(telemetryType, expectedPayload))
            .verifiable(Times.once());

        loggingFunctionMock.setup(f => f(errorMessageStub, errorStub)).verifiable(Times.once());

        testSubject.initialize(loggerStub, windowStub, consoleStub);

        loggerStub.error(errorMessageStub, errorStub);
    });
});
