// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { GearOptionsButtonComponent } from '../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../common/dropdown-click-handler';
import { FeatureFlags } from '../../common/feature-flags';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { title } from '../../content/strings/application';
import { Switcher, SwitcherDeps } from '../components/switcher';

export type HeaderDeps = SwitcherDeps;

export interface IHeaderProps {
    deps: HeaderDeps;
    dropdownClickHandler: DropdownClickHandler;
    featureFlagStoreData: FeatureFlagStoreData;
    tabClosed: boolean;
    selectedPivot: DetailsViewPivotType;
}

export class Header extends React.Component<IHeaderProps> {
    public render(): JSX.Element {
        return (
            <header className="header-bar">
                <img className="header-icon" src="../../icons/brand/white/brand-white-48px.png" alt="" />
                <div className="ms-font-m header-text">{title}</div>
                {this.renderSwitcher()}
                {this.renderButton()}
            </header>
        );
    }

    private renderSwitcher(): JSX.Element {
        if (!this.shouldRenderSwitcher()) {
            return null;
        }

        return <Switcher deps={this.props.deps} pivotKey={this.props.selectedPivot} />;
    }

    private shouldRenderSwitcher(): boolean {
        const { featureFlagStoreData, tabClosed } = this.props;

        return featureFlagStoreData != null && featureFlagStoreData[FeatureFlags.newAssessmentExperience] === true && tabClosed === false;
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
