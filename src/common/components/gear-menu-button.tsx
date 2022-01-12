// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { IconButton, IContextualMenuItem } from '@fluentui/react';
import * as React from 'react';
import { DropdownClickHandler } from '../dropdown-click-handler';
import { FeatureFlags } from '../feature-flags';
import { FeatureFlagStoreData } from '../types/store-data/feature-flag-store-data';
import * as styles from './gear-menu-button.scss';

export type GearMenuButtonDeps = {
    dropdownClickHandler: DropdownClickHandler;
};

export interface GearMenuButtonProps {
    deps: GearMenuButtonDeps;
    featureFlagData: FeatureFlagStoreData;
}

export const GearMenuButton = NamedFC<GearMenuButtonProps>(
    'GearOptionsButtonComponent',
    ({ deps, featureFlagData }) => {
        const getMenuItems = () => {
            const menuToReturn: IContextualMenuItem[] = [
                {
                    key: 'settings',
                    iconProps: {
                        iconName: 'gear',
                    },
                    onClick: deps.dropdownClickHandler.openSettingsPanelHandler,
                    name: 'Settings',
                },
                {
                    key: 'preview-features',
                    iconProps: {
                        iconName: 'giftboxOpen',
                    },
                    onClick: deps.dropdownClickHandler.openPreviewFeaturesPanelHandler,
                    name: 'Preview features',
                    className: 'preview-features-drop-down-button',
                },
            ];

            if (featureFlagData[FeatureFlags.scoping]) {
                menuToReturn.push(getScopingFeatureMenuItem());
            }

            return menuToReturn;
        };

        const getScopingFeatureMenuItem = () => {
            return {
                key: 'scoping-feature',
                iconProps: {
                    iconName: 'scopeTemplate',
                },
                onClick: deps.dropdownClickHandler.openScopingPanelHandler,
                name: 'Scoping',
            };
        };

        return (
            <IconButton
                className={styles.gearMenuButton}
                iconProps={{ iconName: 'Gear' }}
                menuProps={{
                    items: getMenuItems(),
                    calloutProps: {
                        className: styles.gearMenuButtonCallout,
                    },
                }}
                onRenderMenuIcon={() => null}
                ariaLabel="manage settings"
            />
        );
    },
);
