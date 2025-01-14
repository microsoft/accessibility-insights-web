// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { escapeRegExp } from 'lodash';
import { UnhandledErrorTelemetryData } from '../extension-telemetry-events';

export class ExceptionTelemetrySanitizer {
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
        'inspectElement',
    ];
    private readonly exclusionRegex: RegExp;

    constructor(private readonly extensionId: string) {
        this.exclusionRegex = this.generateExclusionRegex();
    }

    public sanitizeTelemetryData(
        telemetryData: UnhandledErrorTelemetryData,
    ): UnhandledErrorTelemetryData | undefined {
        if (telemetryData.message && telemetryData.message.length > this.MAX_MESSAGE_CHARS) {
            telemetryData.message = telemetryData.message.substring(0, this.MAX_MESSAGE_CHARS);
        }
        if (telemetryData.stackTrace && telemetryData.stackTrace.length > this.MAX_STACK_CHARS) {
            telemetryData.stackTrace = telemetryData.stackTrace.substring(0, this.MAX_STACK_CHARS);
        }
        if (
            (telemetryData.message && this.exclusionRegex.test(telemetryData.message)) ||
            (telemetryData.stackTrace && this.exclusionRegex.test(telemetryData.stackTrace))
        ) {
            return undefined;
        }
        return telemetryData;
    }

    private generateExclusionRegex(): RegExp {
        // Use lookahead/lookbehind regex syntax to disallow all urls other than the chrome extension url
        const urlMatchingRegexPart = `(?<!chrome-extension)://|://(?!${this.extensionId})`;
        const questionablePropertyNamePattern =
            this.EXCLUDED_PROPERTIES.map(escapeRegExp).join('|');
        const questionablePropertyPattern = `['"](${questionablePropertyNamePattern})['"]`;
        const questionableSubstringPattern = `${urlMatchingRegexPart}|${questionablePropertyPattern}`;

        // This argument *is* a constant built from literals, it's just built up from parts
        return new RegExp(questionableSubstringPattern);
    }
}
