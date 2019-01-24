// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { FeatureFlags } from '../../common/feature-flags';
import { IBaseStore } from '../../common/istore';
import { DevToolActionMessageCreator } from '../../common/message-creators/dev-tool-action-message-creator';
import { DevToolState } from '../../common/types/store-data/idev-tool-state';
import { DecoratedAxeNodeResult } from '../scanner-utils';
import { DetailsDialogHandler } from './../details-dialog-handler';
import { FixInstructionPanel } from './fix-instruction-panel';
import { CreateIssueDetailsTextData } from '../../common/types/create-issue-details-text-data';
import { CopyIssueDetailsButton, CopyIssueDetailsButtonDeps } from '../../common/components/copy-issue-details-button';
import { TargetPageActionMessageCreator } from '../target-page-action-message-creator';
import { FlaggedComponent } from '../../common/components/flagged-component';
import { ClientBrowserAdapter } from '../../common/client-browser-adapter';

export enum CheckType {
    All,
    Any,
    None,
}

export type DetailsDialogDeps = CopyIssueDetailsButtonDeps & {
    targetPageActionMessageCreator: TargetPageActionMessageCreator;
    clientBrowserAdapter: ClientBrowserAdapter;
};

export interface IDetailsDialogProps {
    deps: DetailsDialogDeps;
    elementSelector: string;
    failedRules: IDictionaryStringTo<DecoratedAxeNodeResult>;
    target: string[];
    dialogHandler: DetailsDialogHandler;
    devToolStore: IBaseStore<DevToolState>;
    devToolActionMessageCreator: DevToolActionMessageCreator;
    featureFlagStoreData: IDictionaryStringTo<boolean>;
    devToolsShortcut: string;
}

export interface IDetailsDialogState {
    showDialog: boolean;
    currentRuleIndex: number;
    canInspect: boolean;
}

export class DetailsDialog extends React.Component<IDetailsDialogProps, IDetailsDialogState> {
    private onHideDialog: () => void;
    public onClickInspectButton: (ev) => void;
    private onLayoutDidMount: () => void;
    public onClickNextButton: () => void;
    public onClickBackButton: () => void;
    public isBackButtonDisabled: () => boolean;
    public isNextButtonDisabled: () => boolean;
    public isInspectButtonDisabled: () => boolean;

    constructor(props: IDetailsDialogProps) {
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

    private renderInspectButton(): JSX.Element {
        return (
            <DefaultButton
                className="insights-dialog-button-inspect"
                disabled={this.props.dialogHandler.isInspectButtonDisabled(this)}
                iconProps={{ iconName: 'FileHTML' }}
                text="Inspect HTML"
                onClick={this.getOnClickWhenNotInShadowDom(this.onClickInspectButton)}
            />
        );
    }

    private renderCreateBugButton(): JSX.Element {
        return <DefaultButton className="insights-dialog-button-create-bug" iconProps={{ iconName: 'add' }} text="New bug" />;
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
                <FlaggedComponent
                    featureFlagStoreData={this.props.featureFlagStoreData}
                    featureFlag={FeatureFlags.showBugFiling}
                    enableJSXElement={this.renderCreateBugButton()}
                />
            </>
        );
    }

    private renderInspectMessage(): JSX.Element {
        if (this.props.dialogHandler.isInspectButtonDisabled(this)) {
            return (
                <div className="insights-dialog-inspect-disabled">
                    {`To enable the Inspect HTML button, open the Chrome dev tools (${this.props.devToolsShortcut}).`}
                </div>
            );
        }
    }

    private renderNextAndBackButton(): JSX.Element {
        return (
            <div className="ms-Grid">
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

    private renderRuleContainer(rule: DecoratedAxeNodeResult): JSX.Element {
        const fixUrl = (url: string) => {
            if (url.indexOf('://') >= 0) {
                return url;
            } else {
                const { clientBrowserAdapter } = this.props.deps;
                return clientBrowserAdapter.getUrl(url);
            }
        };

        return (
            <div className="insights-dialog-rule-container">
                <Icon iconName="StatusErrorFull" />
                <div className="ms-fontSize-mPlus insights-dialog-rule-link">
                    Rule name: <NewTabLink href={fixUrl(rule.helpUrl)}>{rule.ruleId}</NewTabLink>
                </div>
            </div>
        );
    }

    private renderFixInstructions(ruleResult: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div className="insights-dialog-fix-instruction-container">
                <FixInstructionPanel checkType={CheckType.All} checks={ruleResult.all.concat(ruleResult.none)} />

                <FixInstructionPanel checkType={CheckType.Any} checks={ruleResult.any} />
            </div>
        );
    }

    private renderTargetContainer(): JSX.Element {
        return (
            <div className="insights-dialog-target-container">
                <div className="ms-fontWeight-semibold">Path:</div>
                <div className="insights-dialog-instance-selector">{this.props.elementSelector}</div>
                {this.renderButtonContainer()}
            </div>
        );
    }

    private renderDialogContent(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div>
                {this.renderRuleContainer(rule)}
                {this.renderTargetContainer()}
                {this.renderFixInstructions(rule)}
                {this.renderNextAndBackButton()}
            </div>
        );
    }

    private withshadowDomTurnedOn(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div style={{ visibility: this.state.showDialog ? 'visible' : 'hidden' }} className="insights-dialog-main-override-shadow">
                <div className="insights-dialog-container">
                    <div className="insights-dialog-header">
                        <p className="ms-Dialog-title">{rule.help}</p>
                        <div className="ms-Dialog-topButton">
                            <button
                                type="button"
                                className="ms-Dialog-button ms-Dialog-button--close ms-Button ms-Button--icon insights-dialog-close"
                                aria-label="Close"
                                data-is-focusable="true"
                            >
                                <div className="ms-button-flex-container">
                                    <Icon iconName="Cancel" />
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
                dialogContentProps={{
                    type: DialogType.normal,
                }}
                modalProps={{
                    isBlocking: false,
                    containerClassName: 'insights-dialog-main-container',
                    layerProps: {
                        onLayerDidMount: this.onLayoutDidMount,
                        className: 'insights-dialog-main-override',
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
