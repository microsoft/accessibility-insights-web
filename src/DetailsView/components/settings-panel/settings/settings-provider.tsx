// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactSFCWithDisplayName } from '../../../../common/react/named-sfc';
import { SettingsProps } from './settings-props';

export type SettingsComponent = ReactSFCWithDisplayName<SettingsProps>;

export type SettingsProvider = {
    all: () => SettingsComponent[];
};

export const createSettingsProvider = (settings: SettingsComponent[]): SettingsProvider => {
    const all = () => {
        return settings;
    };

    return {
        all,
    };
};
