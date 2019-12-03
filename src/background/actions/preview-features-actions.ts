// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class PreviewFeaturesActions {
    public readonly openPreviewFeatures = new Action<void>();
    public readonly closePreviewFeatures = new Action<void>();
}
