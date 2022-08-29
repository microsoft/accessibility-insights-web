// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';
import { BaseActionPayload } from './action-payloads';

export interface FeatureFlagPayload extends BaseActionPayload {
    feature: string;
    enabled: boolean;
}

export class FeatureFlagActions {
    public readonly getCurrentState = new AsyncAction<void>();
    public readonly setFeatureFlag = new AsyncAction<FeatureFlagPayload>();
    public readonly resetFeatureFlags = new AsyncAction<void>();
}
