// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mapValues } from 'lodash';

import { TelemetryEventSource } from '../../common/extension-telemetry-events';
import { DictionaryStringTo } from '../../types/common-types';
import { BaseActionPayload } from '../actions/action-payloads';
import { TelemetryClient } from './telemetry-client';

export class TelemetryEventHandler {
    constructor(private readonly telemetryClient: TelemetryClient) {}

    public enableTelemetry(): void {
        this.telemetryClient.enableTelemetry();
    }

    public disableTelemetry(): void {
        this.telemetryClient.disableTelemetry();
    }

    public publishTelemetry(eventName: string, payload: BaseActionPayload): void {
        if (payload.telemetry == null) {
            return;
        }

        const telemetryInfo: any = payload.telemetry;
        this.addBasicDataToTelemetry(telemetryInfo);

        const flattenTelemetryInfo: DictionaryStringTo<string> =
            this.flattenTelemetryInfo(telemetryInfo);
        this.telemetryClient.trackEvent(eventName, flattenTelemetryInfo);
    }

    private addBasicDataToTelemetry(telemetryInfo: any): void {
        telemetryInfo.source = TelemetryEventSource[telemetryInfo.source];
    }

    private flattenTelemetryInfo(telemetryInfo: any): DictionaryStringTo<string> {
        const flattenTelemetryInfo: DictionaryStringTo<string> = mapValues(
            telemetryInfo,
            (value, key) => {
                if (typeof value !== 'string') {
                    return JSON.stringify(value);
                }
                return value;
            },
        );

        return flattenTelemetryInfo;
    }
}
