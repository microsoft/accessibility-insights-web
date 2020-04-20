// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ConnectionNames } from 'common/constants/connection-names';

export type DebugToolsTelemetryMessage = {
    timestamp: number;
    name: string;
    source: string;
    triggeredBy: string;
    applicationVersion: string;
    applicationName: string;
    applicationBuild: string;
    installationId: string;
    customProperties: {
        [name: string]: string;
    };
};

export type DebugToolsTelemetryMessageListener = (
    telemetryMessage: DebugToolsTelemetryMessage,
) => void;

type GetDate = () => Date;

export class TelemetryListener {
    private connection: chrome.runtime.Port;
    private listeners: DebugToolsTelemetryMessageListener[] = [];

    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly getDate: GetDate,
    ) {}

    public initialize(): void {
        this.connection = this.browserAdapter.connect({
            name: ConnectionNames.debugToolsTelemetry,
        });

        this.connection.onMessage.addListener(this.onTelemetryMessage);
    }

    private onTelemetryMessage = (telemetryMessage: any) => {
        this.listeners.forEach(listener =>
            listener(convertToDebugToolTelemetryMessage(telemetryMessage, this.getDate)),
        );
    };

    public addListener(listener: DebugToolsTelemetryMessageListener): void {
        this.listeners.push(listener);
    }

    public dispose(): void {
        this.connection.disconnect();
    }
}

function convertToDebugToolTelemetryMessage(
    telemetryMessage: any,
    getDate: GetDate,
): DebugToolsTelemetryMessage {
    const { name, properties } = telemetryMessage;

    const {
        source,
        triggeredBy,
        applicationVersion,
        applicationName,
        applicationBuild,
        installationId,
        // tslint:disable-next-line: trailing-comma
        ...rest
    } = properties;

    return {
        timestamp: getDate().getTime(),
        name,
        source,
        triggeredBy,
        applicationVersion,
        applicationName,
        applicationBuild,
        installationId,
        customProperties: rest,
    };
}
