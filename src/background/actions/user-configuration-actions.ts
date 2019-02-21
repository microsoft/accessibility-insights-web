// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { SetTelemetryStatePayload, SetHighContrastModePayload, SetIssueTrackerPathPayload } from './action-payloads';
import { FeatureFlagPayload } from './feature-flag-actions';

export class UserConfigurationActions {
    public readonly setTelemetryState = new Action<SetTelemetryStatePayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly setHighContrastMode = new Action<SetHighContrastModePayload>();
    public readonly notifyFeatureFlagChange = new Action<FeatureFlagPayload>();
    public readonly setIssueTrackerPath = new Action<SetIssueTrackerPathPayload>();
}
