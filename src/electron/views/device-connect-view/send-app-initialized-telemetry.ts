// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from 'common/types/telemetry-data';
import { APP_INITIALIZED } from 'electron/common/electron-telemetry-events';
import { PlatformInfo } from 'electron/window-management/platform-info';

export const sendAppInitializedTelemetryEvent = (
    telemetryEventHandler: TelemetryEventHandler,
    platformInfo: PlatformInfo,
) => {
    telemetryEventHandler.publishTelemetry(APP_INITIALIZED, {
        telemetry: {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.ElectronDeviceConnect,
            os: platformInfo.getOsName(),
        },
    });
};
