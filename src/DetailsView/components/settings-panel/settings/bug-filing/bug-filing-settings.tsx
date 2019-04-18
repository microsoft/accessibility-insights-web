// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { BugFilingSettingsContainer } from '../../../../../bug-filing/components/bug-filing-settings-container';
import { FlaggedComponent } from '../../../../../common/components/flagged-component';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { SettingsProps } from '../settings-props';
import { GitHubBugSettingsUx } from './github-bug-settings-ux';

export const BugFilingSettings = NamedSFC<SettingsProps>('BugFilingSettings', props => {
    const getBugSettingsUx = () => (
        <>
            <h3>Issue filing</h3>
            <FlaggedComponent
                enableJSXElement={getNewIssueFilingSettingsUx()}
                disableJSXElement={getGitHubBugSettingsUx()}
                featureFlag={FeatureFlags[FeatureFlags.newIssueFilingExperience]}
                featureFlagStoreData={props.featureFlagData}
            />
        </>
    );

    const getNewIssueFilingSettingsUx = () => {
        const { deps, userConfigurationStoreState } = props;
        const { bugFilingServiceProvider, userConfigMessageCreator } = deps;
        const selectedBugFilingService = bugFilingServiceProvider.forKey(userConfigurationStoreState.bugService);
        const selectedBugFilingServiceData = selectedBugFilingService.getSettingsFromStoreData(
            userConfigurationStoreState.bugServicePropertiesMap,
        );
        return (
            <BugFilingSettingsContainer
                deps={deps}
                selectedBugFilingService={selectedBugFilingService}
                selectedBugFilingServiceData={selectedBugFilingServiceData}
                onPropertyUpdateCallback={userConfigMessageCreator.setBugServiceProperty}
                onSelectedServiceChange={userConfigMessageCreator.setBugService}
            />
        );
    };

    const getGitHubBugSettingsUx = () => {
        return <GitHubBugSettingsUx {...props} />;
    };

    return (
        <FlaggedComponent
            enableJSXElement={getBugSettingsUx()}
            featureFlag={FeatureFlags[FeatureFlags.showBugFiling]}
            featureFlagStoreData={props.featureFlagData}
        />
    );
});
