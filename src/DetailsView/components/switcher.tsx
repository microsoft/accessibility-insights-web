// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import * as React from 'react';

import { DetailsViewPivotType } from '../../../src/common/types/details-view-pivot-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

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

    private onRenderOption(option: IDropdownOption): JSX.Element {
        return (
            <div className="switcher-dropdown-option" aria-hidden="true">
                {option.data && option.data.icon && <Icon iconName={option.data.icon} />}
                <span>{option.text}</span>
            </div>
        );
    }

    private onRenderTitle(options: IDropdownOption[]): JSX.Element {
        const option = options[0];

        return (
            <div className="switcher-dropdown-option" aria-hidden="true">
                {option.data && option.data.icon && <Icon iconName={option.data.icon} />}
                <span>{option.text}</span>
            </div>
        );
    }

    @autobind
    private onOptionChange(event, option?: IDropdownOption): void {
        this.setState({ selectedKey: option.key as any });
        this.props.deps.detailsViewActionMessageCreator.sendPivotItemClicked(DetailsViewPivotType[option.data.key]);
    }

    private getOptions(): IDropdownOption[] {
        return [
            {
                key: DetailsViewPivotType.fastPass,
                text: 'FastPass',
                data: {
                    icon: 'Rocket',
                    key: DetailsViewPivotType.fastPass,
                },
            },
            {
                key: DetailsViewPivotType.assessment,
                text: 'Assessment',
                data: {
                    icon: 'testBeaker',
                    key: DetailsViewPivotType.assessment,
                },
            },
        ];
    }

    public render() {
        return (
            <Dropdown
                ariaLabel="select workflow"
                responsiveMode={ResponsiveMode.large}
                selectedKey={this.state.selectedKey}
                onRenderOption={this.onRenderOption}
                onRenderTitle={this.onRenderTitle}
                onChange={this.onOptionChange}
                options={this.getOptions()}
            />
        );
    }
}
