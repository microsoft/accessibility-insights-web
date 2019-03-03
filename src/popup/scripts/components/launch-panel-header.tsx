// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ContextualMenu, ContextualMenuItemType, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';

import { GearOptionsButtonComponent } from '../../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../../common/dropdown-click-handler';
import { FeatureFlags } from '../../../common/feature-flags';
import { TelemetryEventSource } from '../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../common/types/visualization-type';
import { SupportLinkHandler } from '../../support-link-handler';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { LaunchPanelHeaderClickHandler } from '../handlers/launch-panel-header-click-handler';
import Header from './header';

export type LaunchPanelHeaderDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    dropdownClickHandler: DropdownClickHandler;
};

export interface LaunchPanelHeaderProps {
    deps: LaunchPanelHeaderDeps;
    title: string;
    subtitle?: React.ReactChild;
    openAdhocToolsPanel: () => void;
    clickhandler: LaunchPanelHeaderClickHandler;
    supportLinkHandler: SupportLinkHandler;
    popupWindow: Window;
    featureFlags: FeatureFlagStoreData;
}

export interface LaunchPanelHeaderState {
    isContextMenuVisible: boolean;
    target?: MouseEvent;
}

export class LaunchPanelHeader extends React.Component<LaunchPanelHeaderProps, LaunchPanelHeaderState> {
    private readonly telemetryEventSource: TelemetryEventSource = TelemetryEventSource.HamburgerMenu;
    private _onOpenDetailsViewForAllTests: (ev: React.SyntheticEvent<MouseEvent>) => void;
    private _onOpenDetailsViewForAssessment: (ev: React.SyntheticEvent<MouseEvent>) => void;
    private _onOpenDetailsViewForFastPass: (ev: React.SyntheticEvent<MouseEvent>) => void;
    private _onClickLink: (ev?: React.MouseEvent<HTMLElement>, item?: IContextualMenuItem) => void;
    private _openAdhocToolsPanel: (ev?: React.MouseEvent<HTMLElement>, item?: IContextualMenuItem) => void;
    private _onOpenContextualMenu: (event: React.MouseEvent<any>) => void;
    private _onDismissContextualMenu: (event?: any) => void;
    private _openShortcutModifyTab: (event: React.MouseEvent<HTMLElement>) => void;

    constructor(props: LaunchPanelHeaderProps) {
        super(props);
        const { popupActionMessageCreator } = props.deps;
        this._onOpenDetailsViewForAllTests = ev => {
            popupActionMessageCreator.openDetailsView(
                ev,
                VisualizationType.Issues,
                this.telemetryEventSource,
                DetailsViewPivotType.allTest,
            );
        };

        this._onOpenDetailsViewForAssessment = ev => {
            popupActionMessageCreator.openDetailsView(ev, null, this.telemetryEventSource, DetailsViewPivotType.assessment);
        };

        this._onOpenDetailsViewForFastPass = ev =>
            popupActionMessageCreator.openDetailsView(
                ev,
                VisualizationType.Issues,
                this.telemetryEventSource,
                DetailsViewPivotType.fastPass,
            );

        this._onClickLink = (ev, item) => this.props.clickhandler.onClickLink(this.props.popupWindow, ev, item);
        this._onOpenContextualMenu = ev => this.props.clickhandler.onOpenContextualMenu(this, ev);
        this._onDismissContextualMenu = ev => this.props.clickhandler.onDismissFeedbackMenu(this, ev);
        this._openAdhocToolsPanel = (ev, item) => this.props.clickhandler.openAdhocToolsPanel(this);
        this._openShortcutModifyTab = event => {
            popupActionMessageCreator.openShortcutConfigureTab(event);
        };
        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        return (
            <Header title={this.props.title} subtitle={this.props.subtitle} rowExtraClassName="header-title">
                {this.renderGearOptionsButton()}
            </Header>
        );
    }

    private renderGearOptionsButton(): JSX.Element {
        const { dropdownClickHandler } = this.props.deps;

        return (
            <div className="ms-Grid-col ms-u-sm2 feedback-collapseMenuButton-col">
                <GearOptionsButtonComponent dropdownClickHandler={dropdownClickHandler} featureFlags={this.props.featureFlags} />
                <IconButton
                    iconProps={{ iconName: 'GlobalNavButton' }}
                    id="feedback-collapse-menu-button"
                    onClick={this._onOpenContextualMenu}
                    ariaLabel="Help and Feedback menu"
                />
                {this.renderContextualMenu(this.state.isContextMenuVisible)}
            </div>
        );
    }

    private getItems(): IContextualMenuItem[] {
        return [
            {
                key: 'fast-pass',
                iconProps: {
                    iconName: 'Rocket',
                },
                onClick: this._onOpenDetailsViewForFastPass as any,
                name: 'FastPass',
            },
            {
                key: 'full-assessment',
                iconProps: {
                    iconName: 'testBeakerSolid',
                },
                onClick: this._onOpenDetailsViewForAllTests as any,
                name: 'Full Assessment',
            },
            {
                key: 'assessment',
                iconProps: {
                    iconName: 'testBeakerSolid',
                },
                onClick: this._onOpenDetailsViewForAssessment as any,
                name: 'Assessment',
            },
            {
                key: 'ad-hoc-tools',
                iconProps: {
                    iconName: 'Medical',
                },
                name: 'Ad hoc tools',
                onClick: this._openAdhocToolsPanel as any,
            },
            {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider,
            },
            {
                key: 'modify-shortcuts',
                name: 'Keyboard shortcuts',
                onClick: this._openShortcutModifyTab,
            },
            {
                key: 'help',
                iconProps: {
                    iconName: 'Unknown',
                },
                data: 'https://go.microsoft.com/fwlink/?linkid=2077937',
                onClick: this._onClickLink,
                name: 'Help',
            },
        ];
    }

    public renderContextualMenu(isContextMenuVisible: boolean): JSX.Element {
        if (!isContextMenuVisible) {
            return null;
        }

        let items: IContextualMenuItem[] = this.getItems();
        if (this.props.featureFlags[FeatureFlags.newAssessmentExperience]) {
            items = items.filter((value: IContextualMenuItem) => {
                return value.key !== 'full-assessment';
            });
        } else {
            items = items.filter((value: IContextualMenuItem) => {
                return value.key !== 'assessment';
            });
        }

        return (
            <ContextualMenu
                className="popup-menu"
                shouldFocusOnMount={true}
                target={this.state.target}
                onDismiss={this._onDismissContextualMenu}
                directionalHint={getRTL() ? DirectionalHint.bottomRightEdge : DirectionalHint.bottomLeftEdge}
                items={items}
            />
        );
    }
}
