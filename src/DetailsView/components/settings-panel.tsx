// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { TextField } from 'office-ui-fabric-react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import * as React from 'react';

import { FlaggedComponent } from '../../common/components/flagged-component';
import { FeatureFlags } from '../../common/feature-flags';
import { UserConfigMessageCreator } from '../../common/message-creators/user-config-message-creator';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import {
    enableHighContrastSettingsTitle as highContrastSettingsTitle,
    highContrastSettingsDescription,
} from '../../content/settings/high-contrast-mode';
import {
    enableTelemetrySettingDescription,
    enableTelemetrySettingsPanelTitle,
} from '../../content/settings/improve-accessibility-insights';
import { IssueTrackerInput } from '../../content/settings/issue-tracker';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericPanel } from './generic-panel';
import { GenericToggle } from './generic-toggle';

export interface SettingsPanelDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    userConfigMessageCreator: UserConfigMessageCreator;
}

export interface SettingsPanelProps {
    deps: SettingsPanelDeps;
    userConfigStoreState: UserConfigurationStoreData;
    isOpen: boolean;
    featureFlagData: FeatureFlagStoreData;
}
export class SettingsPanel extends React.Component<SettingsPanelProps> {
    public render(): JSX.Element {
        return (
            <GenericPanel
                isOpen={this.props.isOpen}
                className="settings-panel"
                onDismiss={this.props.deps.detailsViewActionMessageCreator.closeSettingsPanel}
                closeButtonAriaLabel="Close settings panel"
                hasCloseButton={true}
                title="Settings"
            >
                <GenericToggle
                    enabled={this.props.userConfigStoreState.enableTelemetry}
                    id="enable-telemetry"
                    name={enableTelemetrySettingsPanelTitle}
                    description={enableTelemetrySettingDescription}
                    onClick={this.onEnableTelemetryToggleClick}
                />
                <FlaggedComponent
                    enableJSXElement={this.getHighContrastToggle()}
                    disableJSXElement={null}
                    featureFlag={FeatureFlags[FeatureFlags.highContrastMode]}
                    featureFlagStoreData={this.props.featureFlagData}
                />
                <FlaggedComponent
                    enableJSXElement={this.getBugSettingsUx()}
                    featureFlag={FeatureFlags[FeatureFlags.showBugFiling]}
                    featureFlagStoreData={this.props.featureFlagData}
                />
            </GenericPanel>
        );
    }

    private getHighContrastToggle(): JSX.Element {
        return (
            <GenericToggle
                enabled={this.props.userConfigStoreState.enableHighContrast}
                id="enable-high-contrast-mode"
                name={highContrastSettingsTitle}
                description={highContrastSettingsDescription}
                onClick={this.onHighContrastModeToggleClick}
            />
        );
    }

    private getBugSettingsUx(): JSX.Element {
        const selectedKey = this.props.userConfigStoreState.bugService || 'none';
        return (
            <>
                <Dropdown
                    label="Select bug service"
                    selectedKey={selectedKey}
                    options={[
                        { key: 'none', text: 'None' },
                        { key: 'azureBoards', text: 'Azure Boards' },
                        { key: 'gitHub', text: 'GitHub' },
                    ]}
                    onChange={this.onBugServiceDropdownChange}
                />
                {this.getProviderBugSettingsUx(selectedKey)}
            </>
        );
    }

    private getIssueTrackerInput(): JSX.Element {
        return (
            <IssueTrackerInput onSave={this.onIssueTrackerPathSave} issueTrackerPath={this.props.userConfigStoreState.issueTrackerPath} />
        );
    }

    @autobind
    protected onEnableTelemetryToggleClick(id: string, state: boolean): void {
        this.props.deps.userConfigMessageCreator.setTelemetryState(state);
    }

    @autobind
    protected onHighContrastModeToggleClick(id: string, state: boolean): void {
        this.props.deps.userConfigMessageCreator.setHighContrastMode(state);
    }

    @autobind
    protected onBugServiceDropdownChange(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void {
        this.props.deps.userConfigMessageCreator.setBugService(option.key as string);
    }

    private getProviderBugSettingsUx(selectedKey: string): JSX.Element {
        // TODO: Will refactor into provider classes later
        switch (selectedKey) {
            case 'azureBoards':
                return this.getAzureBoardsBugSettingsUx();
            case 'gitHub':
                return this.getGitHubBugSettingsUx();
            case 'none':
            default:
                return null;
        }
    }

    private getAzureBoardsBugSettingsUx(): JSX.Element {
        return (
            <>
                <TextField
                    label="Project URL"
                    onChange={this.onAzureBoardsProjectChange}
                    value={this.getBugServiceProperty('azureBoards', 'project')}
                />
                <TextField label="Team" onChange={this.onAzureBoardsTeamChange} value={this.getBugServiceProperty('azureBoards', 'team')} />
            </>
        );
    }

    @autobind
    protected onAzureBoardsProjectChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        this.props.deps.userConfigMessageCreator.setBugServiceProperty('azureBoards', 'project', newValue);
    }

    @autobind
    protected onAzureBoardsTeamChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        this.props.deps.userConfigMessageCreator.setBugServiceProperty('azureBoards', 'team', newValue);
    }

    private getGitHubBugSettingsUx(): JSX.Element {
        return (
            <TextField
                label="Repository URL"
                onChange={this.onGitHubRepositoryChange}
                value={this.getBugServiceProperty('gitHub', 'repository')}
            />
        );
    }

    @autobind
    protected onGitHubRepositoryChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
        this.props.deps.userConfigMessageCreator.setBugServiceProperty('gitHub', 'repository', newValue);
    }

    private getBugServiceProperty(bugService: string, propertyName: string): string {
        const bugServicePropertiesMap = this.props.userConfigStoreState.bugServicePropertiesMap;
        if (!bugServicePropertiesMap || !bugServicePropertiesMap[bugService]) {
            return undefined;
        }
        return this.props.userConfigStoreState.bugServicePropertiesMap[bugService][propertyName];
    }

    @autobind
    protected onIssueTrackerPathSave(id: string, state: string) {
        return this.props.deps.userConfigMessageCreator.setIssueTrackerPath(state);
    }
}
