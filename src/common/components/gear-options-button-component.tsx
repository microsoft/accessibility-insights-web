// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';

import { DetailsViewDropDown } from '../../DetailsView/components/details-view-dropdown';
import { DropdownClickHandler } from '../dropdown-click-handler';
import { FeatureFlags } from '../feature-flags';
import { FeatureFlagStoreData } from '../types/store-data/feature-flag-store-data';

export interface GearOptionsButtonComponentProps {
    dropdownClickHandler: DropdownClickHandler;
    featureFlags: FeatureFlagStoreData;
}

export class GearOptionsButtonComponent extends React.Component<
    GearOptionsButtonComponentProps
> {
    public render(): JSX.Element {
        return (
            <div className="gear-options-button-component">
                {this.renderButton()}
            </div>
        );
    }

    private renderButton(): JSX.Element {
        return <DetailsViewDropDown menuItems={this.getMenuItems()} />;
    }

    private getMenuItems(): IContextualMenuItem[] {
        const menuToReturn = [];
        menuToReturn.push(this.getSettingsMenuItem());

        menuToReturn.push(this.getPreviewFeatureMenuItem());

        if (this.props.featureFlags[FeatureFlags.scoping]) {
            menuToReturn.push(this.getScopingFeatureMenuItem());
        }

        return menuToReturn;
    }

    private getPreviewFeatureMenuItem(): IContextualMenuItem {
        return {
            key: 'preview-features',
            iconProps: {
                iconName: 'giftboxOpen',
            },
            onClick: this.props.dropdownClickHandler
                .openPreviewFeaturesPanelHandler,
            name: 'Preview features',
            className: 'preview-features-drop-down-button',
        };
    }

    private getSettingsMenuItem(): IContextualMenuItem {
        return {
            key: 'settings',
            iconProps: {
                iconName: 'gear',
            },
            onClick: this.props.dropdownClickHandler.openSettingsPanelHandler,
            name: 'Settings',
        };
    }

    private getScopingFeatureMenuItem(): IContextualMenuItem {
        return {
            key: 'scoping-feature',
            iconProps: {
                iconName: 'scopeTemplate',
            },
            onClick: this.props.dropdownClickHandler.openScopingPanelHandler,
            name: 'Scoping',
        };
    }
}
