// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton, IContextualMenuItem } from '@fluentui/react';
import { FlaggedComponent } from 'common/components/flagged-component';
import { GearMenuButton, GearMenuButtonDeps } from 'common/components/gear-menu-button';
import {
    HamburgerMenuButton,
    HamburgerMenuButtonDeps,
} from 'common/components/hamburger-menu-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { Header } from './header';

export type LaunchPanelHeaderDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    dropdownClickHandler: DropdownClickHandler;
} & HamburgerMenuButtonDeps &
    GearMenuButtonDeps;

export interface LaunchPanelHeaderProps {
    deps: LaunchPanelHeaderDeps;
    title: string;
    subtitle?: React.ReactChild;
    openAdhocToolsPanel: () => void;
    popupWindow: Window;
    featureFlags: FeatureFlagStoreData;
}

export type LaunchPanelHeaderState = Pick<IContextualMenuItem, 'target'>;

export class LaunchPanelHeader extends React.Component<
    LaunchPanelHeaderProps,
    LaunchPanelHeaderState
> {
    constructor(props: LaunchPanelHeaderProps) {
        super(props);

        this.state = {};
    }

    public render(): JSX.Element {
        return (
            <Header title={this.props.title} subtitle={this.props.subtitle}>
                {this.renderMenuButtons()}
            </Header>
        );
    }

    private renderMenuButtons(): JSX.Element {
        const { deps, featureFlags } = this.props;
        const { dropdownClickHandler } = deps;

        return (
            <>
                <FlaggedComponent
                    featureFlag={FeatureFlags.debugTools}
                    featureFlagStoreData={featureFlags}
                    enableJSXElement={
                        <IconButton
                            iconProps={{ iconName: 'Cat' }}
                            ariaLabel="open debug tools"
                            onClick={dropdownClickHandler.openDebugTools}
                        />
                    }
                />
                <GearMenuButton deps={this.props.deps} featureFlagData={featureFlags} />
                <HamburgerMenuButton
                    deps={this.props.deps}
                    popupWindow={this.props.popupWindow}
                    header={this}
                />
            </>
        );
    }
}
