// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import * as React from 'react';

import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import * as styles from './switcher.scss';

export type SwitcherDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface SwitcherProps {
    deps: SwitcherDeps;
    pivotKey: DetailsViewPivotType;
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
            <span className={styles.switcherDropdownOption} aria-hidden="true">
                {option.data && option.data.icon && <Icon iconName={option.data.icon} />}
                <span>{option.text}</span>
            </span>
        );
    };

    private onRenderTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];

        return this.onRenderOption(option);
    };

    private onOptionChange = (event, option?: IDropdownOption): void => {
        this.setState({ selectedKey: option.key as any });
        this.props.deps.detailsViewActionMessageCreator.sendPivotItemClicked(DetailsViewPivotType[option.key]);
    };

    private getOptions = (): IDropdownOption[] => {
        return [
            {
                key: DetailsViewPivotType.fastPass,
                text: 'FastPass',
                data: {
                    icon: 'Rocket',
                },
            },
            {
                key: DetailsViewPivotType.assessment,
                text: 'Assessment',
                data: {
                    icon: 'testBeaker',
                },
            },
        ];
    };

    public render(): JSX.Element {
        return (
            <div className={styles.headerSwitcher}>
                <Dropdown
                    className={styles.headerSwitcherDropdown}
                    ariaLabel="select activity"
                    responsiveMode={ResponsiveMode.large}
                    selectedKey={this.state.selectedKey}
                    onRenderOption={this.onRenderOption}
                    onRenderTitle={this.onRenderTitle}
                    onChange={this.onOptionChange}
                    options={this.getOptions()}
                />
            </div>
        );
    }
}
