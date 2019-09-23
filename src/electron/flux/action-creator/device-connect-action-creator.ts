// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { VALIDATE_PORT } from '../../common/electron-telemetry-events';

export class DeviceConnectActionCreator {
    constructor(private readonly telemetryEventHandler: TelemetryEventHandler) {}

    public validatePort(port: number): void {
        this.telemetryEventHandler.publishTelemetry(VALIDATE_PORT, { telemetry: { port } });
    }
}
