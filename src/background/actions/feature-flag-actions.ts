// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SyncAction } from 'common/flux/sync-action';
import { BaseActionPayload } from './action-payloads';

export interface FeatureFlagPayload extends BaseActionPayload {
    feature: string;
    enabled: boolean;
}

export class FeatureFlagActions {
    public readonly getCurrentState = new SyncAction<void>();
    public readonly setFeatureFlag = new SyncAction<FeatureFlagPayload>();
    public readonly resetFeatureFlags = new SyncAction<void>();
}
