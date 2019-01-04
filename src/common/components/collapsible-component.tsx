// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind, css } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

export interface ICollapsibleComponentProps {
    header: JSX.Element;
    content: JSX.Element;
    contentClassName?: string;
    containerClassName?: string;
}

interface ICollapsibleComponentState {
    showContent: boolean;
}

export class CollapsibleComponent extends React.Component<ICollapsibleComponentProps, ICollapsibleComponentState> {

    private readonly iconNameDown = 'ChevronDown';
    private readonly iconNameUp = 'ChevronRight';

    constructor(props: ICollapsibleComponentProps) {
        super(props);
        this.state = { showContent: true };
    }

    @autobind
    private onClick(): void {
        const newState = !this.state.showContent;
        this.setState({ showContent: newState });
    }

    public render(): JSX.Element {
        return (
            <div className={css(this.props.containerClassName, 'collapsible-component')}>
                <ActionButton
                    className="collapsible"
                    iconProps={{ iconName: this.state.showContent ? this.iconNameDown : this.iconNameUp, class: 'collapsible-icon' }}
                    onClick={this.onClick}
                >
                    <span className="collapsible-title">
                        {this.props.header}
                    </span>
                </ActionButton>
                {this.state.showContent ?
                    <div className={css(this.props.contentClassName, 'collapsible-content')}>{this.props.content}</div> : null}
            </div>
        );
    }
}
