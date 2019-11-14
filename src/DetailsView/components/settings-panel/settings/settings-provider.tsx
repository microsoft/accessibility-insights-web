// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactFCWithDisplayName } from '../../../../common/react/named-fc';
import { SettingsProps } from './settings-props';

export type SettingsComponent = ReactFCWithDisplayName<SettingsProps>;

export type SettingsProvider = {
    all: () => SettingsComponent[];
};

export const createSettingsProvider = (
    settings: SettingsComponent[],
): SettingsProvider => {
    const all = () => {
        return settings;
    };

    return {
        all,
    };
};
