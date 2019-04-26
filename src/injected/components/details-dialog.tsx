// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { BaseStore } from '../../common/base-store';
import { ClientBrowserAdapter } from '../../common/client-browser-adapter';
import { CopyIssueDetailsButton, CopyIssueDetailsButtonDeps } from '../../common/components/copy-issue-details-button';
import { FileIssueDetailsButton, FileIssueDetailsButtonDeps } from '../../common/components/file-issue-details-button';
import { FlaggedComponent } from '../../common/components/flagged-component';
import { GuidanceLinks } from '../../common/components/guidance-links';
import { IssueFilingButton, IssueFilingButtonDeps } from '../../common/components/issue-filing-button';
import { IssueFilingNeedsSettingsHelpText } from '../../common/components/issue-filing-needs-settings-help-text';
import { NewTabLink } from '../../common/components/new-tab-link';
import { FeatureFlags } from '../../common/feature-flags';
import { CancelIcon } from '../../common/icons/cancel-icon';
import { FileHTMLIcon } from '../../common/icons/file-html-icon';
import { StatusErrorFullIcon } from '../../common/icons/status-error-full-icon';
import { DevToolActionMessageCreator } from '../../common/message-creators/dev-tool-action-message-creator';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { DevToolState } from '../../common/types/store-data/idev-tool-state';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DictionaryStringTo } from '../../types/common-types';
import { HyperlinkDefinition } from '../../views/content/content-page';
import { DetailsDialogHandler } from '../details-dialog-handler';
import { DecoratedAxeNodeResult } from '../scanner-utils';
import { TargetPageActionMessageCreator } from '../target-page-action-message-creator';
import { FixInstructionPanel } from './fix-instruction-panel';

export enum CheckType {
    All,
    Any,
    None,
}

export type DetailsDialogDeps = {
    targetPageActionMessageCreator: TargetPageActionMessageCreator;
    clientBrowserAdapter: ClientBrowserAdapter;
} & CopyIssueDetailsButtonDeps &
    FileIssueDetailsButtonDeps &
    IssueFilingButtonDeps;

export interface DetailsDialogProps {
    deps: DetailsDialogDeps;
    userConfigStore: BaseStore<UserConfigurationStoreData>;
    elementSelector: string;
    failedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
    target: string[];
    dialogHandler: DetailsDialogHandler;
    devToolStore: BaseStore<DevToolState>;
    devToolActionMessageCreator: DevToolActionMessageCreator;
    featureFlagStoreData: DictionaryStringTo<boolean>;
    devToolsShortcut: string;
}

export interface DetailsDialogState {
    showDialog: boolean;
    currentRuleIndex: number;
    canInspect: boolean;
    issueTrackerPath: string;
    userConfigurationStoreData: UserConfigurationStoreData;
}

export class DetailsDialog extends React.Component<DetailsDialogProps, DetailsDialogState> {
    private onHideDialog: () => void;
    public onClickInspectButton: (ev) => void;
    private onLayoutDidMount: () => void;
    public onClickNextButton: () => void;
    public onClickBackButton: () => void;
    public isBackButtonDisabled: () => boolean;
    public isNextButtonDisabled: () => boolean;
    public isInspectButtonDisabled: () => boolean;

    constructor(props: DetailsDialogProps) {
        super(props);

        this.onHideDialog = () => {
            this.props.dialogHandler.hideDialog(this);
        };
        this.onClickNextButton = () => {
            this.props.dialogHandler.nextButtonClickHandler(this);
        };
        this.onClickBackButton = () => {
            this.props.dialogHandler.backButtonClickHandler(this);
        };
        this.onClickInspectButton = (ev: React.SyntheticEvent<MouseEvent>) => {
            this.props.dialogHandler.inspectButtonClickHandler(this, ev);
        };
        this.onLayoutDidMount = () => {
            this.props.dialogHandler.onLayoutDidMount();
        };
        this.componentDidMount = () => {
            this.props.dialogHandler.componentDidMount(this);
        };
        this.componentWillUnmount = () => {
            this.props.dialogHandler.componentWillUnmount(this);
        };
        this.onClickNextButton = () => {
            this.props.dialogHandler.nextButtonClickHandler(this);
        };
        this.onClickBackButton = () => {
            this.props.dialogHandler.backButtonClickHandler(this);
        };
        this.isBackButtonDisabled = () => {
            return this.props.dialogHandler.isBackButtonDisabled(this);
        };
        this.isNextButtonDisabled = () => {
            return this.props.dialogHandler.isNextButtonDisabled(this);
        };
        this.isInspectButtonDisabled = () => {
            return this.props.dialogHandler.isInspectButtonDisabled(this);
        };

        this.state = {
            showDialog: true,
            currentRuleIndex: 0,
            canInspect: true,
            issueTrackerPath: '',
            userConfigurationStoreData: null,
        };
    }

    public render(): JSX.Element {
        const failedRuleIds: string[] = Object.keys(this.props.failedRules);
        const ruleName: string = failedRuleIds[this.state.currentRuleIndex];
        const rule: DecoratedAxeNodeResult = this.props.failedRules[ruleName];

        if (this.props.featureFlagStoreData[FeatureFlags.shadowDialog]) {
            return this.withshadowDomTurnedOn(rule);
        } else {
            return this.withshadowDomTurnedOff(rule);
        }
    }

    private getOnClickWhenNotInShadowDom(func: (ev: any) => void): (ev: any) => void {
        if (this.props.featureFlagStoreData[FeatureFlags.shadowDialog]) {
            return null;
        } else {
            return func;
        }
    }

    private renderButtonContainer(): JSX.Element {
        return (
            <div className="insights-dialog-target-button-container">
                {this.renderInspectButton()}
                {this.renderIssueButtons()}
                {this.renderInspectMessage()}
            </div>
        );
    }

    private renderCloseIcon(): JSX.Element {
        return <CancelIcon />;
    }

    private renderInspectButton(): JSX.Element {
        return (
            <DefaultButton
                className="insights-dialog-button-inspect"
                disabled={this.props.dialogHandler.isInspectButtonDisabled(this)}
                onClick={this.getOnClickWhenNotInShadowDom(this.onClickInspectButton)}
            >
                <FileHTMLIcon />
                <div className="ms-Button-label">Inspect HTML</div>
            </DefaultButton>
        );
    }

    private renderFileIssueButton(issueData: CreateIssueDetailsTextData): JSX.Element {
        const oldExperienceButton: JSX.Element = (
            <FileIssueDetailsButton
                deps={this.props.deps}
                issueDetailsData={issueData}
                issueTrackerPath={this.state.issueTrackerPath}
                restoreFocus={false}
            />
        );
        const newExperienceButton: JSX.Element = (
            <IssueFilingButton
                deps={this.props.deps}
                issueDetailsData={issueData}
                userConfigurationStoreData={this.state.userConfigurationStoreData}
                needsSettingsContentRenderer={IssueFilingNeedsSettingsHelpText}
            />
        );
        return (
            <FlaggedComponent
                enableJSXElement={newExperienceButton}
                featureFlag={FeatureFlags[FeatureFlags.newIssueFilingExperience]}
                disableJSXElement={oldExperienceButton}
                featureFlagStoreData={this.props.featureFlagStoreData}
            />
        );
    }

    private renderIssueButtons(): JSX.Element {
        const failedRuleIds: string[] = Object.keys(this.props.failedRules);
        const ruleName: string = failedRuleIds[this.state.currentRuleIndex];
        const ruleResult: DecoratedAxeNodeResult = this.props.failedRules[ruleName];
        const issueData: CreateIssueDetailsTextData = {
            pageTitle: document.title,
            pageUrl: document.URL,
            ruleResult,
        };

        return (
            <>
                <CopyIssueDetailsButton
                    deps={this.props.deps}
                    issueDetailsData={issueData}
                    onClick={this.props.deps.targetPageActionMessageCreator.copyIssueDetailsClicked}
                />
                {this.renderFileIssueButton(issueData)}
            </>
        );
    }

    private renderInspectMessage(): JSX.Element {
        if (this.props.dialogHandler.isInspectButtonDisabled(this)) {
            return (
                <div className="insights-dialog-inspect-disabled">
                    {`To enable the Inspect HTML button, open the developer tools (${this.props.devToolsShortcut}).`}
                </div>
            );
        }
    }

    private renderNextAndBackButtons(): JSX.Element {
        return (
            <div className="ms-Grid insights-dialog-next-and-back-container">
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 insights-dialog-button-left">
                        <PrimaryButton
                            data-automation-id="back"
                            disabled={this.props.dialogHandler.isBackButtonDisabled(this)}
                            text="< Back"
                            onClick={this.getOnClickWhenNotInShadowDom(this.onClickBackButton)}
                        />
                    </div>
                    <div className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 insights-dialog-footer">
                        <div>{this.props.dialogHandler.getFailureInfo(this)}</div>
                    </div>
                    <div className="ms-Grid-col ms-sm3 ms-md3 ms-lg3 insights-dialog-button-right">
                        <PrimaryButton
                            data-automation-id="next"
                            disabled={this.props.dialogHandler.isNextButtonDisabled(this)}
                            text="Next >"
                            onClick={this.getOnClickWhenNotInShadowDom(this.onClickNextButton)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private renderSectionTitle(sectionTitle: string, className?: string): JSX.Element {
        const allClassNames = ['insights-dialog-section-title', className].filter(t => t != null);
        return <h3 className={allClassNames.join(' ')}>{sectionTitle}</h3>;
    }

    private renderRuleName(rule: DecoratedAxeNodeResult): JSX.Element {
        const fixUrl = (url: string) => {
            if (url.indexOf('://') >= 0) {
                return url;
            } else {
                const { clientBrowserAdapter } = this.props.deps;
                return clientBrowserAdapter.getUrl(url);
            }
        };

        return (
            <div className="insights-dialog-rule-name">
                {this.renderSectionTitle('Rule name')}
                <NewTabLink href={fixUrl(rule.helpUrl)}>{rule.ruleId}</NewTabLink>
            </div>
        );
    }

    private renderSuccessCriteria(ruleGuidanceLinks: HyperlinkDefinition[]): JSX.Element {
        if (!ruleGuidanceLinks || ruleGuidanceLinks.length === 0) {
            return null;
        }
        const sectionTitle: string = ruleGuidanceLinks.length === 1 ? 'Success criterion' : 'Success criteria';

        return (
            <div className="insights-dialog-success-criteria">
                {this.renderSectionTitle(sectionTitle)}
                <GuidanceLinks links={ruleGuidanceLinks} />
            </div>
        );
    }

    private renderPathSelector(): JSX.Element {
        return (
            <div className="insights-dialog-path-selector-container">
                {this.renderSectionTitle('Path')}
                {this.props.elementSelector}
            </div>
        );
    }

    private renderFixInstructions(ruleResult: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div className="insights-dialog-fix-instruction-container">
                <FixInstructionPanel
                    checkType={CheckType.All}
                    checks={ruleResult.all.concat(ruleResult.none)}
                    renderTitleElement={this.renderSectionTitle}
                />
                <FixInstructionPanel checkType={CheckType.Any} checks={ruleResult.any} renderTitleElement={this.renderSectionTitle} />
            </div>
        );
    }

    private renderDialogContent(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div className="insights-dialog-content">
                {this.renderRuleName(rule)}
                {this.renderSuccessCriteria(rule.guidanceLinks)}
                {this.renderPathSelector()}
                {this.renderButtonContainer()}
                {this.renderFixInstructions(rule)}
                {this.renderNextAndBackButtons()}
            </div>
        );
    }

    private withshadowDomTurnedOn(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div style={{ visibility: this.state.showDialog ? 'visible' : 'hidden' }} className="insights-dialog-main-override-shadow">
                <div className="insights-dialog-container">
                    <div className="insights-dialog-header">
                        <p className="ms-Dialog-title insights-dialog-title">{rule.help}</p>
                        <div className="ms-Dialog-topButton">
                            <button
                                type="button"
                                className="ms-Dialog-button ms-Dialog-button--close ms-Button ms-Button--icon insights-dialog-close"
                                aria-label="Close"
                                data-is-focusable="true"
                            >
                                <div className="ms-button-flex-container">
                                    <CancelIcon />
                                </div>
                            </button>
                        </div>
                    </div>

                    {this.renderDialogContent(rule)}
                </div>
            </div>
        );
    }

    private withshadowDomTurnedOff(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <Dialog
                hidden={!this.state.showDialog}
                // Used top button instead of default close button to avoid use of fabric icons that might not load due to target page's Content Security Policy
                dialogContentProps={{
                    type: DialogType.normal,
                    showCloseButton: false,
                    topButtonsProps: [
                        {
                            ariaLabel: 'Close',
                            onRenderIcon: this.renderCloseIcon,
                            onClick: this.onHideDialog,
                        },
                    ],
                    styles: { title: 'insights-dialog-title' },
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'insights-dialog-main-container',
                    layerProps: {
                        onLayerDidMount: this.onLayoutDidMount,
                        className: 'insights-dialog-main-override',
                        hostId: 'insights-dialog-layer-host',
                    },
                }}
                onDismiss={this.onHideDialog}
                title={rule.help}
            >
                {this.renderDialogContent(rule)}
            </Dialog>
        );
    }
}
