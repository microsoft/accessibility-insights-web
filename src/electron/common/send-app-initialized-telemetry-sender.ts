// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { TelemetryEventHandler } from '../../background/telemetry/telemetry-event-handler';
import { TelemetryEventSource, TriggeredByNotApplicable } from '../../common/extension-telemetry-events';
import { APP_INITIALIZED } from './electron-telemetry-events';

export const sendAppInitializedTelemetryEvent = (
    userConfigurationData: UserConfigurationStoreData,
    telemetryEventHandler: TelemetryEventHandler,
) => {
    // not sending the telemetry event the first time the user opens the app
    // this way, we let the user opt in or out before sending the first event
    if (userConfigurationData.isFirstTime) {
        return;
    }

    telemetryEventHandler.publishTelemetry(APP_INITIALIZED, {
        telemetry: {
            triggeredBy: TriggeredByNotApplicable,
            source: TelemetryEventSource.ElectronDeviceConnect,
        },
    });
};
