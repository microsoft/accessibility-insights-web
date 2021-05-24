// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStore } from 'common/base-store';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import {
    FixInstructionPanel,
    FixInstructionPanelDeps,
} from 'common/components/fix-instruction-panel';
import { GuidanceLinks } from 'common/components/guidance-links';
import { NewTabLink } from 'common/components/new-tab-link';
import { CancelIcon } from 'common/icons/cancel-icon';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { DevToolStoreData } from 'common/types/store-data/dev-tool-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { isEmpty, size } from 'lodash';
import { Dialog, DialogType } from 'office-ui-fabric-react';
import { css } from 'office-ui-fabric-react';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';

import { CheckType } from '../../common/types/check-type';
import { DetailsDialogHandler } from '../details-dialog-handler';
import { DecoratedAxeNodeResult } from '../scanner-utils';
import { TargetPageActionMessageCreator } from '../target-page-action-message-creator';
import { CommandBar, CommandBarDeps, CommandBarProps } from './command-bar';
import {
    IssueDetailsNavigationControls,
    IssueDetailsNavigationControlsProps,
} from './issue-details-navigation-controls';

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
    devToolsShortcut: string;
}

export interface DetailsDialogState {
    showDialog: boolean;
    currentRuleIndex: number;
    canInspect: boolean;
    userConfigurationStoreData: UserConfigurationStoreData;
    showInspectMessage: boolean;
    showInsecureOriginPageMessage: boolean;
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
    public onClickCopyIssueDetailsButton: (ev) => void;
    public shouldShowInsecureOriginPageMessage: () => boolean;

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
        this.onClickCopyIssueDetailsButton = (ev: React.MouseEvent<MouseEvent>) => {
            this.props.dialogHandler.copyIssueDetailsButtonClickHandler(this, ev);
        };
        this.shouldShowInsecureOriginPageMessage = () => {
            return this.props.dialogHandler.shouldShowInsecureOriginPageMessage(this);
        };
        this.state = {
            showDialog: true,
            currentRuleIndex: 0,
            // eslint-disable-next-line react/no-unused-state
            canInspect: true,
            // eslint-disable-next-line react/no-unused-state
            showInspectMessage: false,
            userConfigurationStoreData: props.userConfigStore.getState(),
            // eslint-disable-next-line react/no-unused-state
            showInsecureOriginPageMessage: false,
        };
    }

    public render(): JSX.Element {
        const failedRuleIds: string[] = Object.keys(this.props.failedRules);
        const ruleName: string = failedRuleIds[this.state.currentRuleIndex];
        const rule: DecoratedAxeNodeResult = this.props.failedRules[ruleName];

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

    private renderCommandBar(): JSX.Element {
        const props: CommandBarProps = {
            currentRuleIndex: this.state.currentRuleIndex,
            deps: this.props.deps,
            devToolsShortcut: this.props.devToolsShortcut,
            failedRules: this.props.failedRules,
            onClickCopyIssueDetailsButton: this.onClickCopyIssueDetailsButton,
            onClickInspectButton: this.onClickInspectButton,
            shouldShowInspectButtonMessage: () =>
                this.props.dialogHandler.shouldShowInspectButtonMessage(this),
            userConfigurationStoreData: this.state.userConfigurationStoreData,
            hasSecureTargetPage: this.props.dialogHandler.isTargetPageOriginSecure(),
            shouldShowInsecureOriginPageMessage: this.shouldShowInsecureOriginPageMessage(),
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
}
