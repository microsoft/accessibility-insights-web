// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { Icon } from '@fluentui/react';
import { ResponsiveMode } from '@fluentui/react';
import { FeatureFlags } from 'common/feature-flags';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';

import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import styles from './switcher.scss';

export type SwitcherDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface SwitcherProps {
    deps: SwitcherDeps;
    pivotKey: DetailsViewPivotType;
    featureFlagStoreData: FeatureFlagStoreData;
}

export interface SwitcherState {
    selectedKey: DetailsViewPivotType;
}

export class Switcher extends React.Component<SwitcherProps, SwitcherState> {
    constructor(props: SwitcherProps) {
        super(props);
        this.state = { selectedKey: props.pivotKey };
    }

    public componentDidUpdate(prevProps: Readonly<SwitcherProps>): void {
        if (prevProps.pivotKey !== this.props.pivotKey) {
            this.setState(() => ({ selectedKey: this.props.pivotKey }));
        }
    }

    private onRenderOption = (option: IDropdownOption): JSX.Element => {
        return (
            <span className={styles.switcherDropdownOption}>
                {option.data && option.data.icon && <Icon iconName={option.data.icon} />}
                <span>{option.text}</span>
            </span>
        );
    };

    private onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];

        return this.onRenderOption(option);
    };

    private onOptionChange = (event, option: IDropdownOption): void => {
        this.setState({ selectedKey: option.key as any });
        this.props.deps.detailsViewActionMessageCreator.sendPivotItemClicked(
            DetailsViewPivotType[option.key],
        );
    };

    private getOptions = (featureFlagStoreData: FeatureFlagStoreData): IDropdownOption[] => {
        const fastPassConfig = {
            key: DetailsViewPivotType.fastPass,
            text: 'FastPass',
            title: 'FastPass',
            data: {
                icon: 'Rocket',
            },
        };
        const mediumPassConfig = {
            key: DetailsViewPivotType.mediumPass,
            text: 'Quick Assess',
            title: 'Quick Assess',
            data: {
                icon: 'SiteScan',
            },
        };
        const assessmentConfig = {
            key: DetailsViewPivotType.assessment,
            text: 'Assessment',
            title: 'Assessment',
            data: {
                icon: 'testBeakerSolid',
            },
        };
        return featureFlagStoreData[FeatureFlags.mediumPass]
            ? [fastPassConfig, mediumPassConfig, assessmentConfig]
            : [fastPassConfig, assessmentConfig];
    };

    public render(): JSX.Element {
        return (
            <div className={styles.leftNavSwitcher} role="region" aria-label="activity">
                <Dropdown
                    className={styles.leftNavSwitcherDropdown}
                    ariaLabel="select activity"
                    responsiveMode={ResponsiveMode.large}
                    selectedKey={this.state.selectedKey}
                    onRenderOption={this.onRenderOption}
                    onRenderTitle={this.onRenderTitle}
                    onChange={this.onOptionChange}
                    options={this.getOptions(this.props.featureFlagStoreData)}
                />
            </div>
        );
    }
}
