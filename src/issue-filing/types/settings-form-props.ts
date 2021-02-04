// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetIssueFilingServicePropertyPayload } from 'background/actions/action-payloads';
import { IssueFilingServiceProperties } from 'common/types/store-data/user-configuration-store';
import { SettingsDeps } from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';

export type SettingsFormProps<Settings extends IssueFilingServiceProperties> = {
    deps: SettingsDeps;
    settings: Settings;
    onPropertyUpdateCallback: (payload: SetIssueFilingServicePropertyPayload) => void;
};
