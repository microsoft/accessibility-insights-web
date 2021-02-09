// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { BaseLeftNav, BaseLeftNavLink } from 'DetailsView/components/base-left-nav';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { LeftNavItem } from 'electron/types/left-nav-item';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import * as styles from 'electron/views/left-nav/left-nav.scss';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';

export type LeftNavDeps = {
    leftNavItems: LeftNavItem[];
    navLinkRenderer: NavLinkRenderer;
};

export type LeftNavProps = {
    deps: LeftNavDeps;
    selectedKey: LeftNavItemKey;
    featureFlagStoreData: FeatureFlagStoreData;
};

export const leftNavAutomationId = 'left-nav';

export const LeftNav = NamedFC<LeftNavProps>('LeftNav', props => {
    const { deps } = props;
    const leftNavItemsFiltered = deps.leftNavItems.filter(item =>
        filterForFeatureFlag(item, props.featureFlagStoreData),
    );
    const leftLinkItems: BaseLeftNavLink[] = leftNavItemsFiltered.map((item, index) => ({
        name: item.displayName,
        key: item.key,
        onClickNavLink: item.onSelect,
        onRenderNavLink: deps.navLinkRenderer.renderVisualizationLink,
        url: '',
        index: index + 1,
        iconProps: {
            className: 'hidden',
        },
        forceAnchor: true,
    }));

    return (
        <div data-automation-id={leftNavAutomationId} className={styles.leftNav}>
            <div className={styles.headerContainer}>
                <Icon iconName={'Rocket'} className={styles.rocketIcon} />
                <h3>FastPass</h3>
            </div>
            <BaseLeftNav selectedKey={props.selectedKey} links={leftLinkItems} />
        </div>
    );
});

const filterForFeatureFlag = (
    config: LeftNavItem,
    featureFlagStoreData: FeatureFlagStoreData,
): boolean => {
    return config.featureFlag === undefined || featureFlagStoreData[config.featureFlag];
};
