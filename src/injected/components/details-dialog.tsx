// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FixInstructionPanel,
    FixInstructionPanelDeps,
} from 'common/components/fix-instruction-panel';
import { isEmpty, size } from 'lodash';
import { css } from 'office-ui-fabric-react';
import { Dialog, DialogType } from 'office-ui-fabric-react';
import * as React from 'react';
import { HyperlinkDefinition } from 'views/content/content-page';

import { BaseStore } from '../../common/base-store';
import { BrowserAdapter } from '../../common/browser-adapters/browser-adapter';
import { GuidanceLinks } from '../../common/components/guidance-links';
import { NewTabLink } from '../../common/components/new-tab-link';
import { FeatureFlags } from '../../common/feature-flags';
import { CancelIcon } from '../../common/icons/cancel-icon';
import { DevToolActionMessageCreator } from '../../common/message-creators/dev-tool-action-message-creator';
import { DevToolStoreData } from '../../common/types/store-data/dev-tool-store-data';
import { UserConfigurationStoreData } from '../../common/types/store-data/user-configuration-store';
import { DictionaryStringTo } from '../../types/common-types';
import { DetailsDialogHandler } from '../details-dialog-handler';
import { DecoratedAxeNodeResult } from '../scanner-utils';
import { TargetPageActionMessageCreator } from '../target-page-action-message-creator';
import { CommandBar, CommandBarDeps, CommandBarProps } from './command-bar';
import {
    IssueDetailsNavigationControls,
    IssueDetailsNavigationControlsProps,
} from './issue-details-navigation-controls';

export enum CheckType {
    All,
    Any,
    None,
}

export type DetailsDialogDeps = {
    targetPageActionMessageCreator: TargetPageActionMessageCreator;
    browserAdapter: BrowserAdapter;
} & CommandBarDeps &
    FixInstructionPanelDeps;

export interface DetailsDialogProps {
    deps: DetailsDialogDeps;
    userConfigStore: BaseStore<UserConfigurationStoreData>;
    elementSelector: string;
    failedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
    target: string[];
    dialogHandler: DetailsDialogHandler;
    devToolStore: BaseStore<DevToolStoreData>;
    devToolActionMessageCreator: DevToolActionMessageCreator;
    featureFlagStoreData: DictionaryStringTo<boolean>;
    devToolsShortcut: string;
}

export interface DetailsDialogState {
    showDialog: boolean;
    currentRuleIndex: number;
    canInspect: boolean;
    userConfigurationStoreData: UserConfigurationStoreData;
    showInspectMessage: boolean;
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
            showInspectMessage: false,
            userConfigurationStoreData: props.userConfigStore.getState(),
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

    private renderCommandBar(): JSX.Element {
        const props: CommandBarProps = {
            currentRuleIndex: this.state.currentRuleIndex,
            deps: this.props.deps,
            devToolsShortcut: this.props.devToolsShortcut,
            failedRules: this.props.failedRules,
            onClickCopyIssueDetailsButton: this.props.deps.targetPageActionMessageCreator
                .copyIssueDetailsClicked,
            onClickInspectButton: this.getOnClickWhenNotInShadowDom(this.onClickInspectButton),
            shouldShowInspectButtonMessage: () =>
                this.props.dialogHandler.shouldShowInspectButtonMessage(this),
            userConfigurationStoreData: this.state.userConfigurationStoreData,
        };

        return <CommandBar {...props} />;
    }

    private renderCloseIcon(): JSX.Element {
        return <CancelIcon />;
    }

    private renderNextAndBackButtons(): JSX.Element {
        const navigationControlsProps: IssueDetailsNavigationControlsProps = {
            container: this,
            dialogHandler: this.props.dialogHandler,
            featureFlagStoreData: this.props.featureFlagStoreData,
            failuresCount: size(this.props.failedRules),
        };

        return <IssueDetailsNavigationControls {...navigationControlsProps} />;
    }

    private renderSectionTitle(sectionTitle: string, ariaLabel?: string): JSX.Element {
        return (
            <h3 className={css('insights-dialog-section-title')} id={ariaLabel}>
                {sectionTitle}
            </h3>
        );
    }

    private renderRuleName(rule: DecoratedAxeNodeResult): JSX.Element {
        const fixUrl = (url: string) => {
            if (url.indexOf('://') >= 0) {
                return url;
            } else {
                const { browserAdapter } = this.props.deps;
                return browserAdapter.getUrl(url);
            }
        };

        const ruleNameID = 'rule-name';

        return (
            <section className="insights-dialog-rule-name" aria-labelledby={ruleNameID}>
                {this.renderSectionTitle('Rule name', ruleNameID)}
                <NewTabLink href={fixUrl(rule.helpUrl)}>{rule.ruleId}</NewTabLink>
            </section>
        );
    }

    private renderSuccessCriteria(ruleGuidanceLinks: HyperlinkDefinition[]): JSX.Element {
        if (isEmpty(ruleGuidanceLinks)) {
            return null;
        }
        const sectionTitle: string =
            ruleGuidanceLinks.length === 1 ? 'Success criterion' : 'Success criteria';
        const successTitleId = 'success-criteria';

        return (
            <section className="insights-dialog-success-criteria" aria-labelledby={successTitleId}>
                {this.renderSectionTitle(sectionTitle, successTitleId)}
                <div>
                    <GuidanceLinks
                        links={ruleGuidanceLinks}
                        LinkComponent={this.props.deps.LinkComponent}
                    />
                </div>
            </section>
        );
    }

    private renderPathSelector(): JSX.Element {
        return (
            <section className="insights-dialog-path-selector-container">
                {this.renderSectionTitle('Path')}
                {this.props.elementSelector}
            </section>
        );
    }

    private renderFixInstructions(ruleResult: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div className="insights-dialog-fix-instruction-container">
                <FixInstructionPanel
                    deps={this.props.deps}
                    checkType={CheckType.All}
                    checks={ruleResult.all.concat(ruleResult.none)}
                    renderTitleElement={this.renderSectionTitle}
                />
                <FixInstructionPanel
                    deps={this.props.deps}
                    checkType={CheckType.Any}
                    checks={ruleResult.any}
                    renderTitleElement={this.renderSectionTitle}
                />
            </div>
        );
    }

    private renderDialogContent(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div className="insights-dialog-content">
                {this.renderRuleName(rule)}
                {this.renderSuccessCriteria(rule.guidanceLinks)}
                {this.renderPathSelector()}
                {this.renderCommandBar()}
                {this.renderFixInstructions(rule)}
                {this.renderNextAndBackButtons()}
            </div>
        );
    }

    private withshadowDomTurnedOn(rule: DecoratedAxeNodeResult): JSX.Element {
        return (
            <div
                style={{ visibility: this.state.showDialog ? 'visible' : 'hidden' }}
                className="insights-dialog-main-override-shadow"
            >
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
                                <span className="ms-button-flex-container">
                                    <CancelIcon />
                                </span>
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
                    containerClassName:
                        'insights-dialog-main-override insights-dialog-main-container',
                    layerProps: {
                        onLayerDidMount: this.onLayoutDidMount,
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
