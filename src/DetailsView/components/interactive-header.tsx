// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { Header, HeaderDeps } from 'common/components/header';
import { NamedFC } from 'common/react/named-fc';
import { GearOptionsButtonComponent } from '../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
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

    return (
        <Header deps={props.deps}>
            <Switcher deps={props.deps} pivotKey={props.selectedPivot} />
            <GearOptionsButtonComponent dropdownClickHandler={props.dropdownClickHandler} featureFlags={props.featureFlagStoreData} />
        </Header>
    );
});
