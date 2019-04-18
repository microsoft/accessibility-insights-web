// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from '../../common/react/named-sfc';
import { BugFilingService } from '../types/bug-filing-service';
import { SettingsFormProps } from '../types/settings-form-props';

const nullServiceKey = 'none';

const settingsForm = NamedSFC<SettingsFormProps<{}>>('NullIssueFilingService', () => null);

export type NullIssueFilingServiceSettings = null;

export const NullIssueFilingService: BugFilingService = {
    key: nullServiceKey,
    isHidden: true,
    order: 0,
    displayName: 'None',
    settingsForm,
    buildStoreData: () => null,
    isSettingsValid: () => false,
    getSettingsFromStoreData: () => null,
    issueFilingUrlProvider: () => null,
};
