// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton, IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';
import { DropdownClickHandler } from '../dropdown-click-handler';
import { FeatureFlags } from '../feature-flags';
import { FeatureFlagStoreData } from '../types/store-data/feature-flag-store-data';

export interface GearOptionsButtonComponentProps {
    dropdownClickHandler: DropdownClickHandler;
    featureFlags: FeatureFlagStoreData;
}

export class GearOptionsButtonComponent extends React.Component<GearOptionsButtonComponentProps> {
    public render(): JSX.Element {
        return (
            <IconButton
                iconProps={{ iconName: 'Gear' }}
                menuProps={{ items: this.getMenuItems() }}
                onRenderMenuIcon={() => null}
                ariaLabel="manage settings"
            />
        );
    }

    private getMenuItems(): IContextualMenuItem[] {
        const menuToReturn: IContextualMenuItem[] = [
            {
                key: 'settings',
                iconProps: {
                    iconName: 'gear',
                },
                onClick: this.props.dropdownClickHandler.openSettingsPanelHandler,
                name: 'Settings',
            },
            {
                key: 'preview-features',
                iconProps: {
                    iconName: 'giftboxOpen',
                },
                onClick: this.props.dropdownClickHandler.openPreviewFeaturesPanelHandler,
                name: 'Preview features',
                className: 'preview-features-drop-down-button',
            },
        ];

        if (this.props.featureFlags[FeatureFlags.scoping]) {
            menuToReturn.push(this.getScopingFeatureMenuItem());
        }

        return menuToReturn;
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
