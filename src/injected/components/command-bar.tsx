// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseButton } from '@fluentui/react';
import { Button, mergeClasses } from '@fluentui/react-components';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import * as React from 'react';

import {
    CopyIssueDetailsButton,
    CopyIssueDetailsButtonDeps,
} from '../../common/components/copy-issue-details-button';
import {
    IssueFilingButton,
    IssueFilingButtonDeps,
} from '../../common/components/issue-filing-button';
import { IssueFilingNeedsSettingsHelpText } from '../../common/components/issue-filing-needs-settings-help-text';
import { FileHTMLIcon } from '../../common/icons/file-html-icon';
import { NamedFC } from '../../common/react/named-fc';
import styles from '../../common/styles/button.scss';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { AxeResultToIssueFilingDataConverter } from '../../issue-filing/rule-result-to-issue-filing-data';
import { DictionaryStringTo } from '../../types/common-types';

export type CommandBarDeps = CopyIssueDetailsButtonDeps &
    IssueFilingButtonDeps & {
        axeResultToIssueFilingDataConverter: AxeResultToIssueFilingDataConverter;
    };

export type CommandBarProps = {
    deps: CommandBarDeps;
    onClickInspectButton: (
        event: React.MouseEvent<
            typeof Button | BaseButton | HTMLDivElement | HTMLAnchorElement | HTMLButtonElement,
            MouseEvent
        >,
    ) => void;
    onClickCopyIssueDetailsButton: (event: React.MouseEvent<any, MouseEvent>) => void;
    failedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
    currentRuleIndex: number;
    userConfigurationStoreData: UserConfigurationStoreData;
    shouldShowInspectButtonMessage: () => boolean;
    devToolsShortcut: string;
    hasSecureTargetPage: boolean;
    shouldShowInsecureOriginPageMessage: boolean;
};

export const CommandBar = NamedFC<CommandBarProps>('CommandBar', props => {
    const renderInspectButton = (): JSX.Element => {
        return (
            <Button
                className={mergeClasses('insights-dialog-button-inspect', styles.detailsDialogButton)}
                onClick={props.onClickInspectButton}
            >
                <FileHTMLIcon />
                <div className="ms-Button-label">Inspect HTML</div>
            </Button>
        );
    };

    const renderIssueButtons = (): JSX.Element => {
        const failedRuleIds: string[] = Object.keys(props.failedRules);
        const ruleName: string = failedRuleIds[props.currentRuleIndex];
        const ruleResult: DecoratedAxeNodeResult = props.failedRules[ruleName];

        const issueData = props.deps.axeResultToIssueFilingDataConverter.convert(
            ruleResult,
            document.title,
            document.URL,
        );

        return (
            <>
                {renderCopyIssueDetailsButton(issueData)}
                {renderFileIssueButton(issueData)}
            </>
        );
    };

    const renderCopyIssueDetailsButton = (issueData: CreateIssueDetailsTextData): JSX.Element => {
        return (
            <CopyIssueDetailsButton
                deps={props.deps}
                issueDetailsData={issueData}
                onClick={props.onClickCopyIssueDetailsButton}
                hasSecureTargetPage={props.hasSecureTargetPage}
            />
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

    const renderInspectMessage = (): JSX.Element | undefined => {
        if (props.shouldShowInspectButtonMessage()) {
            return (
                <div role="alert" className="insights-dialog-inspect-disabled">
                    {`To use the Inspect HTML button, first open the developer tools (${props.devToolsShortcut}).`}
                </div>
            );
        }
    };

    const renderCopyIssueDetailsMessage = (): JSX.Element | undefined => {
        if (props.shouldShowInsecureOriginPageMessage) {
            return (
                <div role="alert" className="copy-issue-details-button-help">
                    To copy failure details, first open the Accessibility Insights for Web page.
                </div>
            );
        }
    };

    return (
        <div className="insights-dialog-target-button-container">
            {renderInspectButton()}
            {renderIssueButtons()}
            {renderInspectMessage()}
            {renderCopyIssueDetailsMessage()}
        </div>
    );
});
