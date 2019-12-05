// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { Header, HeaderDeps } from 'common/components/header';
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

export class InteractiveHeader extends React.Component<InteractiveHeaderProps> {
    public render(): JSX.Element {
        return (
            <Header deps={this.props.deps}>
                {this.renderSwitcher()}
                {this.renderButton()}
            </Header>
        );
    }

    private renderSwitcher(): JSX.Element {
        if (this.props.tabClosed === true) {
            return null;
        }

        return <Switcher deps={this.props.deps} pivotKey={this.props.selectedPivot} />;
    }

    private renderButton(): JSX.Element {
        if (this.props.tabClosed) {
            return null;
        }

        return (
            <GearOptionsButtonComponent
                dropdownClickHandler={this.props.dropdownClickHandler}
                featureFlags={this.props.featureFlagStoreData}
            />
        );
    }
}
