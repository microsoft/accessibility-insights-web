// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedSFC } from '../../common/react/named-sfc';
import { BugFilingService } from '../types/bug-filing-service';
import { SettingsFormProps } from '../types/settings-form-props';

const nullServiceKey = 'none';

const renderSettingsForm = NamedSFC<SettingsFormProps<{}>>('NullIssueFilingService', () => null);

export const NullIssueFilingService: BugFilingService = {
    key: nullServiceKey,
    isHidden: true,
    order: 0,
    displayName: 'None',
    renderSettingsForm,
    buildStoreData: () => null,
    isSettingsValid: () => false,
    createBugFilingUrl: () => null,
};
