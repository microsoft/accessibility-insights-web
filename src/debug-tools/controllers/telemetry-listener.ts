// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Messages } from 'common/messages';

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
    private listeners: DebugToolsTelemetryMessageListener[] = [];

    constructor(private readonly getDate: GetDate) {}

    public readonly handleBrowserMessage = (browserMessage: any): void | Promise<void> => {
        if (browserMessage.messageType === Messages.DebugTools.Telemetry) {
            this.listeners.forEach(listener =>
                listener(convertToDebugToolTelemetryMessage(browserMessage, this.getDate)),
            );

            return Promise.resolve(); // Indicates that we "handled" the message
        }
    };

    public addListener(listener: DebugToolsTelemetryMessageListener): void {
        this.listeners.push(listener);
    }

    public removeListener(listener: DebugToolsTelemetryMessageListener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
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
