// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GearMenuButton } from 'common/components/gear-menu-button';
import { Header, HeaderDeps } from 'common/components/header';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { Switcher, SwitcherDeps } from './switcher';

export type InteractiveHeaderDeps = SwitcherDeps & HeaderDeps;

export interface InteractiveHeaderProps {
    deps: InteractiveHeaderDeps;
    dropdownClickHandler: DropdownClickHandler;
    featureFlagStoreData: FeatureFlagStoreData;
    tabClosed: boolean;
    selectedPivot: DetailsViewPivotType;
}

export const InteractiveHeader = NamedFC<InteractiveHeaderProps>('InteractiveHeader', props => {
    if (props.tabClosed) {
        return <Header deps={props.deps} />;
    }

    const getNearItems = () => <Switcher deps={props.deps} pivotKey={props.selectedPivot} />;

    const getFarItems = () => (
        <GearMenuButton
            dropdownClickHandler={props.dropdownClickHandler}
            featureFlags={props.featureFlagStoreData}
        />
    );

    return <Header deps={props.deps} items={getNearItems()} farItems={getFarItems()}></Header>;
});
