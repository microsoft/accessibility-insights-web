// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { SetBugServicePayload, SetHighContrastModePayload, SetTelemetryStatePayload } from './action-payloads';
import { FeatureFlagPayload } from './feature-flag-actions';

export class UserConfigurationActions {
    public readonly setTelemetryState = new Action<SetTelemetryStatePayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly setBugService = new Action<SetBugServicePayload>();
    public readonly notifyFeatureFlagChange = new Action<FeatureFlagPayload>();
}
