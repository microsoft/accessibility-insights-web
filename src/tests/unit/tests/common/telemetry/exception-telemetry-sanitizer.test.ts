// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    ErrorType,
    TelemetryEventSource,
    UnhandledErrorTelemetryData,
} from 'common/extension-telemetry-events';
import { ExceptionTelemetrySanitizer } from 'common/telemetry/exception-telemetry-sanitizer';

describe(ExceptionTelemetrySanitizer, () => {
    let extensionIdStub;
    let errorMessageStub: string;
    let errorStub: Error;
    let telemetryStub: UnhandledErrorTelemetryData;
    let expectedTelemetry: UnhandledErrorTelemetryData;
    const source: TelemetryEventSource = TelemetryEventSource.AdHocTools;
    const errorType: ErrorType = ErrorType.ConsoleError;

    let testSubject: ExceptionTelemetrySanitizer;

    beforeEach(async () => {
        extensionIdStub = 'extensionId';
        errorMessageStub = 'Error message';
        errorStub = new Error();

        testSubject = new ExceptionTelemetrySanitizer(extensionIdStub);
    });

    describe('it truncates long data', () => {
        afterEach(() => {
            const sanitizedTelemetry = testSubject.sanitizeTelemetryData(telemetryStub);

            expect(sanitizedTelemetry).toMatchObject(expectedTelemetry);
        });

        test('it truncates messages beyond size cap', () => {
            errorMessageStub = 'very long message'.repeat(30);

            telemetryStub = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType,
                source,
            };

            expectedTelemetry = {
                message: errorMessageStub.substring(0, 300),
                stackTrace: errorStub.stack,
                errorType,
                source,
            };
        });

        test('it truncates stack traces beyond size cap', () => {
            errorStub.stack = 'very long stack'.repeat(500);

            telemetryStub = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType,
                source,
            };

            expectedTelemetry = {
                message: errorMessageStub,
                stackTrace: errorStub.stack.substring(0, 5000),
                errorType,
                source,
            };
        });
    });

    describe('it returns undefined on invalid data', () => {
        afterEach(() => {
            telemetryStub = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType,
                source,
            };

            const sanitizedTelemetry = testSubject.sanitizeTelemetryData(telemetryStub);

            expect(sanitizedTelemetry).toBeUndefined();
        });

        test('it does not send data that includes urls', () => {
            errorMessageStub = 'https://accessibilityinsights.io/';
        });

        test('it does not send data that includes file urls', () => {
            errorMessageStub = 'file://test.html';
        });

        test('it does not send data that includes other extension urls', () => {
            errorMessageStub = 'chrome-extension://otherExtensionId';
        });

        test('it does not send data that includes urls with our extensionId', () => {
            errorMessageStub = `https://fake/url/${extensionIdStub}`;
        });

        test('it does not send data that includes single quoted properties', () => {
            errorMessageStub = "'html'";
        });

        test('it does not send data that includes double quoted properties', () => {
            errorMessageStub = '"html"';
        });
    });

    describe('returns valid data', () => {
        afterEach(() => {
            telemetryStub = {
                message: errorMessageStub,
                stackTrace: errorStub.stack,
                errorType,
                source,
            };

            const sanitizedTelemetry = testSubject.sanitizeTelemetryData(telemetryStub);

            expect(sanitizedTelemetry).toMatchObject(telemetryStub);
        });

        test('it allows stacks to include extension url', () => {
            errorMessageStub = `chrome-extension://${extensionIdStub}`;
        });

        test('it allows stacks to unquoted properties', () => {
            errorMessageStub = `fake message containing html and path`;
        });
    });
});
