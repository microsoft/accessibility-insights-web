// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react';
import { ResponsiveMode } from 'office-ui-fabric-react';
import * as React from 'react';

import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export type SwitcherDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface SwitcherStyleNames {
    dropdownOptionClassName: string;
    switcherClassName: string;
    dropdownClassName: string;
}

export interface SwitcherProps {
    deps: SwitcherDeps;
    pivotKey: DetailsViewPivotType;
    styles: SwitcherStyleNames;
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
            <span className={this.props.styles.dropdownOptionClassName}>
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
        this.props.deps.detailsViewActionMessageCreator.sendPivotItemClicked(
            DetailsViewPivotType[option.key],
        );
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
                    icon: 'testBeakerSolid',
                },
            },
        ];
    };

    public render(): JSX.Element {
        return (
            <div className={this.props.styles.switcherClassName}>
                <Dropdown
                    className={this.props.styles.dropdownClassName}
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
