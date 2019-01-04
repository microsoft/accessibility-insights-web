// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';

export interface GenericToggleProps {
    enabled: boolean;
    name: string;
    id: string;
    description?: string | JSX.Element;
    onClick: (id: string, enabled: boolean, event: React.MouseEvent<HTMLElement>) => void;
}

export class GenericToggle extends React.Component<GenericToggleProps> {

    public render(): JSX.Element {
        return (
            <div className={'generic-toggle-component'}>
                <div className={'toggle-container'}>
                    <div className={'toggle-name'}>{this.props.name}</div>
                    <Toggle
                        className={'toggle'}
                        checked={this.props.enabled}
                        onClick={this.onClick}
                        onText={'On'}
                        offText={'Off'}
                        onAriaLabel={this.props.name}
                        offAriaLabel={this.props.name}
                    />
                </div>
                <div className={'toggle-description'}>
                    {this.props.description}
                </div>
            </div>
        );
    }

    @autobind
    protected onClick(event: React.MouseEvent<HTMLElement>): void {
        this.props.onClick(this.props.id, !this.props.enabled, event);
    }
}
