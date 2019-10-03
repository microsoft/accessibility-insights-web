// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from '../../../background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from '../../../common/extension-telemetry-events';
import { APP_INITIALIZED } from '../../common/electron-telemetry-events';

export const sendAppInitializedTelemetryEvent = (telemetryEventHandler: TelemetryEventHandler) => {
    telemetryEventHandler.publishTelemetry(APP_INITIALIZED, {
        telemetry: {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.ElectronDeviceConnect,
        },
    });
};
