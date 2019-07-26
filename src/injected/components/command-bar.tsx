// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseButton, Button, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { CopyIssueDetailsButton, CopyIssueDetailsButtonDeps } from '../../common/components/copy-issue-details-button';
import { IssueFilingButton, IssueFilingButtonDeps } from '../../common/components/issue-filing-button';
import { IssueFilingNeedsSettingsHelpText } from '../../common/components/issue-filing-needs-settings-help-text';
import { FileHTMLIcon } from '../../common/icons/file-html-icon';
import { NamedSFC } from '../../common/react/named-sfc';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DecoratedAxeNodeResult } from '../scanner-utils';

export type CommandBarDeps = CopyIssueDetailsButtonDeps & IssueFilingButtonDeps;

export type CommandBarProps = {
    deps: CommandBarDeps;
    onClickInspectButton: (
        event: React.MouseEvent<Button | BaseButton | HTMLDivElement | HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
    ) => void;
    onClickCopyIssueDetailsButton: (event: React.MouseEvent<any, MouseEvent>) => void;
    selectedRule: DecoratedAxeNodeResult;
    userConfigurationStoreData: UserConfigurationStoreData;
    shouldShowInspectButtonMessage: () => boolean;
    devToolsShortcut: string;
};

export const CommandBar = NamedSFC<CommandBarProps>('CommandBar', props => {
    const renderInspectButton = (): JSX.Element => {
        return (
            <DefaultButton className="insights-dialog-button-inspect" onClick={props.onClickInspectButton}>
                <FileHTMLIcon />
                <div className="ms-Button-label">Inspect HTML</div>
            </DefaultButton>
        );
    };

    const renderIssueButtons = (): JSX.Element => {
        const issueData: CreateIssueDetailsTextData = {
            pageTitle: document.title,
            pageUrl: document.URL,
            ruleResult: props.selectedRule,
        };

        return (
            <>
                <CopyIssueDetailsButton deps={props.deps} issueDetailsData={issueData} onClick={props.onClickCopyIssueDetailsButton} />
                {renderFileIssueButton(issueData)}
            </>
        );
    };

    const renderFileIssueButton = (issueData: CreateIssueDetailsTextData): JSX.Element => {
        return (
            <IssueFilingButton
                deps={props.deps}
                issueDetailsData={issueData}
                userConfigurationStoreData={props.userConfigurationStoreData}
                needsSettingsContentRenderer={IssueFilingNeedsSettingsHelpText}
            />
        );
    };

    const renderInspectMessage = (): JSX.Element => {
        if (props.shouldShowInspectButtonMessage()) {
            return (
                <div className="insights-dialog-inspect-disabled">
                    {`To use the Inspect HTML button, first open the developer tools (${props.devToolsShortcut}).`}
                </div>
            );
        }
    };

    return (
        <div className="insights-dialog-target-button-container">
            {renderInspectButton()}
            {renderIssueButtons()}
            {renderInspectMessage()}
        </div>
    );
});
