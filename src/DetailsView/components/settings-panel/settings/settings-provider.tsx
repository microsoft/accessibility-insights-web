// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { SettingsProps } from './settings-props';
import { ReactSFCWithDisplayName } from '../../../../common/react/named-sfc';

export type SettingsComponent = ReactSFCWithDisplayName<SettingsProps>;

export type SettingsProvider = {
    all: () => SettingsComponent[];
};

export const create = (settings: SettingsComponent[]): SettingsProvider => {
    const all = () => {
        return settings;
    };

    return {
        all,
    };
};
