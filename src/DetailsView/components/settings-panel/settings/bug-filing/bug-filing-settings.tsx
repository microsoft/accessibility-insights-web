// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { FlaggedComponent } from '../../../../../common/components/flagged-component';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { SettingsProps } from '../setting';

export type BugFilingSettingsDeps = {
    userConfigMessageCreator: UserConfigMessageCreator;
};

export type BugFilingSettingsProps = SettingsProps<BugFilingSettingsDeps>;

export const BugFilingSettings = NamedSFC<BugFilingSettingsProps>('BugFilingSettings', props => {
    const getBugSettingsUx = () => {
        return (
            <>
                <h3>Issue filing</h3>
                {getGitHubBugSettingsUx()}
            </>
        );
    };

    const getGitHubBugSettingsUx = () => {
        return (
            <TextField
                className="issue-setting"
                label="Enter desired GitHub repo link:"
                onChange={onGitHubRepositoryChange}
                value={getBugServiceProperty('gitHub', 'repository')}
                placeholder="https://github.com/owner/repo/issues"
            />
        );
    };

    const onGitHubRepositoryChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        props.deps.userConfigMessageCreator.setBugServiceProperty('gitHub', 'repository', newValue);
    };

    const getBugServiceProperty = (bugService: string, propertyName: string) => {
        const bugServicePropertiesMap = props.userConfigigurationStoreSate.bugServicePropertiesMap;
        if (!bugServicePropertiesMap || !bugServicePropertiesMap[bugService]) {
            return undefined;
        }
        return props.userConfigigurationStoreSate.bugServicePropertiesMap[bugService][propertyName];
    };

    return (
        <FlaggedComponent
            enableJSXElement={getBugSettingsUx()}
            featureFlag={FeatureFlags[FeatureFlags.showBugFiling]}
            featureFlagStoreData={props.featureFlagData}
        />
    );
});
