// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ExpandCollpaseLeftNavButtonProps } from 'common/components/expand-collapse-left-nav-hamburger-button';
import { FlaggedComponent } from 'common/components/flagged-component';
import { GearMenuButton, GearMenuButtonDeps } from 'common/components/gear-menu-button';
import { Header, HeaderDeps } from 'common/components/header';
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { headerSwitcherStyleNames } from 'DetailsView/components/switcher-style-names';
import * as React from 'react';
import { Switcher, SwitcherDeps } from './switcher';

export type InteractiveHeaderDeps = SwitcherDeps & HeaderDeps & GearMenuButtonDeps;

export interface InteractiveHeaderProps {
    deps: InteractiveHeaderDeps;
    featureFlagStoreData: FeatureFlagStoreData;
    tabClosed: boolean;
    selectedPivot: DetailsViewPivotType;
    navMenu: ReactFCWithDisplayName<ExpandCollpaseLeftNavButtonProps>;
    isNarrowMode: boolean;
    isSideNavOpen: boolean;
    setSideNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InteractiveHeader = NamedFC<InteractiveHeaderProps>('InteractiveHeader', props => {
    if (props.tabClosed) {
        return <Header deps={props.deps} />;
    }

    const getNavMenu = () => {
        if (props.isNarrowMode === false) {
            return null;
        }

        return (
            <props.navMenu
                setSideNavOpen={props.setSideNavOpen}
                isSideNavOpen={props.isSideNavOpen}
            />
        );
    };

    const getItems = () => {
        const switcher = (
            <Switcher
                deps={props.deps}
                pivotKey={props.selectedPivot}
                styles={headerSwitcherStyleNames}
            />
        );
        return (
            <FlaggedComponent
                featureFlag={FeatureFlags[FeatureFlags.reflowUI]}
                featureFlagStoreData={props.featureFlagStoreData}
                enableJSXElement={null}
                disableJSXElement={switcher}
            />
        );
    };

    const getFarItems = () => (
        <GearMenuButton deps={props.deps} featureFlagData={props.featureFlagStoreData} />
    );

    return (
        <Header
            deps={props.deps}
            items={getItems()}
            farItems={getFarItems()}
            navMenu={getNavMenu()}
        ></Header>
    );
});
