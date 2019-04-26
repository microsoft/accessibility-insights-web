// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingServicePropertiesMap } from '../../common/types/store-data/user-configuration-store';

export const createSettingsGetter = <Settings>(serviceKey: string) => {
    return (bugServicePropertiesMap: IssueFilingServicePropertiesMap): Settings => {
        return bugServicePropertiesMap[serviceKey] as Settings;
    };
};
