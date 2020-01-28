// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GearOptionsButtonComponent } from 'common/components/gear-options-button-component';
import {
    HamburgerMenuButton,
    HamburgerMenuButtonDeps,
} from 'common/components/hamburger-menu-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { LaunchPanelHeaderClickHandler } from '../handlers/launch-panel-header-click-handler';
import { Header } from './header';

export type LaunchPanelHeaderDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    dropdownClickHandler: DropdownClickHandler;
    launchPanelHeaderClickHandler: LaunchPanelHeaderClickHandler;
} & HamburgerMenuButtonDeps;

export interface LaunchPanelHeaderProps {
    deps: LaunchPanelHeaderDeps;
    title: string;
    subtitle?: React.ReactChild;
    openAdhocToolsPanel: () => void;
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
            <Header title={this.props.title} subtitle={this.props.subtitle}>
                {this.renderMenuButtons()}
            </Header>
        );
    }

    private renderMenuButtons(): JSX.Element {
        const { dropdownClickHandler } = this.props.deps;

        return (
            <>
                <GearOptionsButtonComponent
                    dropdownClickHandler={dropdownClickHandler}
                    featureFlags={this.props.featureFlags}
                />
                <HamburgerMenuButton
                    deps={this.props.deps}
                    popupWindow={this.props.popupWindow}
                    header={this}
                />
            </>
        );
    }
}
