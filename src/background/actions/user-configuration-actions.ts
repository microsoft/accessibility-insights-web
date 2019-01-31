// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { SetTelemetryStatePayload, SetHighContrastModePayload } from './action-payloads';

export class UserConfigurationActions {
    public readonly setTelemetryState = new Action<SetTelemetryStatePayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHighContrastMode = new Action<SetHighContrastModePayload>();
}
