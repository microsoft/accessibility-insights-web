// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { FlaggedComponent } from '../../../../../common/components/flagged-component';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { SettingsProps } from '../settings-props';

export const BugFilingSettings = NamedSFC<SettingsProps>('BugFilingSettings', props => {
    const getBugSettingsUx = () => (
        <>
            <h3>Issue filing</h3>
            {getGitHubBugSettingsUx()}
        </>
    );

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
        const bugServicePropertiesMap = props.userConfigurationStoreState.bugServicePropertiesMap;
        if (!bugServicePropertiesMap || !bugServicePropertiesMap[bugService]) {
            return undefined;
        }
        return bugServicePropertiesMap[bugService][propertyName];
    };

    return (
        <FlaggedComponent
            enableJSXElement={getBugSettingsUx()}
            featureFlag={FeatureFlags[FeatureFlags.showBugFiling]}
            featureFlagStoreData={props.featureFlagData}
        />
    );
});
