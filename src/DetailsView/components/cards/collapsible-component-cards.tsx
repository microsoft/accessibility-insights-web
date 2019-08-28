// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import { collapsibleContainer, collapsibleContent, collapsibleControl, collapsibleTitle } from './collapsible-component-cards.scss';

export interface CollapsibleComponentCardsProps {
    header: JSX.Element;
    content: JSX.Element;
    contentClassName?: string;
    containerClassName?: string;
    buttonAriaLabel?: string;
}

interface CollapsibleComponentCardsState {
    showContent: boolean;
}

export class CollapsibleComponentCards extends React.Component<CollapsibleComponentCardsProps, CollapsibleComponentCardsState> {
    constructor(props: CollapsibleComponentCardsProps) {
        super(props);
        this.state = { showContent: true };
    }

    private onClick = (): void => {
        const newState = !this.state.showContent;
        this.setState({ showContent: newState });
    };

    public render(): JSX.Element {
        const showContent = this.state.showContent;
        let content = null;
        let collapsedCSSClassName = 'collapsed';

        if (showContent) {
            content = <div className={css(this.props.contentClassName, collapsibleContent)}>{this.props.content}</div>;
            collapsedCSSClassName = null;
        }

        return (
            <div className={css(this.props.containerClassName, collapsibleContainer, collapsedCSSClassName)}>
                <ActionButton
                    className={collapsibleControl}
                    onClick={this.onClick}
                    aria-expanded={showContent}
                    ariaLabel={this.props.buttonAriaLabel}
                >
                    <span className={collapsibleTitle}>{this.props.header}</span>
                </ActionButton>
                {content}
            </div>
        );
    }
}
