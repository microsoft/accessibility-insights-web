// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryData } from 'common/extension-telemetry-events';
import { Message } from 'common/message';

export interface Dispatcher {
    dispatchMessage(message: Message): void;
    dispatchType(messageType: string): void;
    sendTelemetry(eventName: string, eventData: TelemetryData): void;
}
