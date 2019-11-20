// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { GearOptionsButtonComponent } from '../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { LaunchPanelHeaderClickHandler } from '../handlers/launch-panel-header-click-handler';
import { SupportLinkHandler } from '../support-link-handler';
import { Header } from './header';
import {
    HeaderContextualMenu,
    HeaderContextualMenuDeps,
} from './header-contextual-menu';

export type LaunchPanelHeaderDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    dropdownClickHandler: DropdownClickHandler;
    launchPanelHeaderClickHandler: LaunchPanelHeaderClickHandler;
} & HeaderContextualMenuDeps;

export interface LaunchPanelHeaderProps {
    deps: LaunchPanelHeaderDeps;
    title: string;
    subtitle?: React.ReactChild;
    openAdhocToolsPanel: () => void;
    supportLinkHandler: SupportLinkHandler;
    popupWindow: Window;
    featureFlags: FeatureFlagStoreData;
}

export type LaunchPanelHeaderState = {
    isContextMenuVisible: boolean;
} & Pick<IContextualMenuItem, 'target'>;

export class LaunchPanelHeader extends React.Component<
    LaunchPanelHeaderProps,
    LaunchPanelHeaderState
> {
    constructor(props: LaunchPanelHeaderProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        return (
            <Header
                title={this.props.title}
                subtitle={this.props.subtitle}
                rowExtraClassName="header-title"
            >
                {this.renderGearOptionsButton()}
            </Header>
        );
    }

    private renderGearOptionsButton(): JSX.Element {
        const {
            dropdownClickHandler,
            launchPanelHeaderClickHandler,
        } = this.props.deps;

        return (
            <div className="ms-Grid-col ms-u-sm2 feedback-collapseMenuButton-col">
                <GearOptionsButtonComponent
                    dropdownClickHandler={dropdownClickHandler}
                    featureFlags={this.props.featureFlags}
                />
                <IconButton
                    iconProps={{ iconName: 'GlobalNavButton' }}
                    id="feedback-collapse-menu-button"
                    onClick={event =>
                        launchPanelHeaderClickHandler.onOpenContextualMenu(
                            this,
                            event,
                        )
                    }
                    ariaLabel="Help and Feedback menu"
                />
                {this.renderContextualMenu(this.state.isContextMenuVisible)}
            </div>
        );
    }

    public renderContextualMenu(isContextMenuVisible: boolean): JSX.Element {
        if (!isContextMenuVisible) {
            return null;
        }

        const { deps, popupWindow, featureFlags } = this.props;

        const props = {
            deps,
            popupWindow,
            featureFlags,
            header: this,
            target: this.state.target,
        };

        return <HeaderContextualMenu {...props} />;
    }
}
