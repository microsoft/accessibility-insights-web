// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type FeatureFlagChecker = {
    isEnabled: (feature: string) => boolean;
};
