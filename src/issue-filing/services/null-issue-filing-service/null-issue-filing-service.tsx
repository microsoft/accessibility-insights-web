// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';

import { IssueFilingService } from '../../types/issue-filing-service';
import { SettingsFormProps } from '../../types/settings-form-props';

const nullServiceKey = 'none';

const settingsForm = NamedFC<SettingsFormProps<{}>>('NullIssueFilingService', () => null);

export type NullIssueFilingServiceSettings = null;

export const NullIssueFilingService: IssueFilingService = {
    key: nullServiceKey,
    isHidden: true,
    displayName: 'None',
    settingsForm,
    buildStoreData: () => null,
    isSettingsValid: () => false,
    getSettingsFromStoreData: () => null,
    fileIssue: () => Promise.resolve(),
};
