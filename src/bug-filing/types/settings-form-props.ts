// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SettingsDeps } from './../../DetailsView/components/settings-panel/settings/settings-props';

export type SettingsFormProps<Settings> = {
    deps: SettingsDeps;
    settings: Settings;
};
