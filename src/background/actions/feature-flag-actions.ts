// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';

import { BaseActionPayload } from './action-payloads';

export interface IFeatureFlagPayload extends BaseActionPayload {
    feature: string;
    enabled: boolean;
}

export class FeatureFlagActions {
    public readonly getCurrentState = new Action<void>();
    public readonly setFeatureFlag = new Action<IFeatureFlagPayload>();
    public readonly resetFeatureFlags = new Action<void>();
}
