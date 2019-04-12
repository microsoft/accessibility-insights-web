// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { BugFilingService } from '../types/bug-filing-service';
import { SettingsFormProps } from '../types/settings-form-props';

const nullServiceKey = 'none';

const settingsForm = NamedSFC<SettingsFormProps<{}>>('NullIssueFilingService', () => {
    return <div>Please select a configuration.</div>;
});

export const NullIssueFilingService: BugFilingService = {
    key: nullServiceKey,
    isHidden: true,
    order: 0,
    displayName: 'None',
    settingsForm,
    buildStoreData: () => null,
    isSettingsValid: () => false,
    createBugFilingUrl: () => null,
    getSettingsFromStoreData: () => null,
};
