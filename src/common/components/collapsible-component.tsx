// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react';
import * as React from 'react';

export interface CollapsibleComponentProps {
    header: JSX.Element;
    content: JSX.Element;
    contentClassName?: string;
    containerClassName?: string;
}

interface CollapsibleComponentState {
    showContent: boolean;
}

export class CollapsibleComponent extends React.Component<
    CollapsibleComponentProps,
    CollapsibleComponentState
> {
    private readonly iconNameDown = 'ChevronDown';
    private readonly iconNameUp = 'ChevronRight';

    constructor(props: CollapsibleComponentProps) {
        super(props);
        this.state = { showContent: true };
    }

    private onClick = (): void => {
        const newState = !this.state.showContent;
        this.setState({ showContent: newState });
    };

    public render(): JSX.Element {
        const showContent = this.state.showContent;
        let iconName = this.iconNameUp;
        let content: JSX.Element | null = null;

        if (showContent) {
            iconName = this.iconNameDown;
            content = (
                <div className={css(this.props.contentClassName, 'collapsible-content')}>
                    {this.props.content}
                </div>
            );
        }

        return (
            <div className={css(this.props.containerClassName, 'collapsible-component')}>
                <ActionButton
                    className="collapsible"
                    iconProps={{ iconName: iconName, class: 'collapsible-icon' }}
                    onClick={this.onClick}
                    aria-expanded={showContent}
                >
                    <span className="collapsible-title">{this.props.header}</span>
                </ActionButton>
                {content}
            </div>
        );
    }
}
