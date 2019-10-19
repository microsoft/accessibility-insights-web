// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { CardInteractionSupport } from 'common/components/cards/card-interaction-support';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

import {
    collapsibleContainer,
    collapsibleContainerContent,
    collapsibleControl,
    collapsibleTitle,
} from './collapsible-component-cards.scss';

export type CollapsibleComponentCardsDeps = {
    cardInteractionSupport: CardInteractionSupport;
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};

export interface CollapsibleComponentCardsProps {
    header: JSX.Element;
    content: JSX.Element;
    headingLevel: number;
    contentClassName?: string;
    containerClassName?: string;
    buttonAriaLabel?: string;
    id?: string;
    deps: CollapsibleComponentCardsDeps;
    isExpanded?: boolean;
}

interface CollapsibleComponentCardsState {
    showContent: boolean;
}

class CollapsibleComponentCards extends React.Component<CollapsibleComponentCardsProps, CollapsibleComponentCardsState> {
    constructor(props: CollapsibleComponentCardsProps) {
        super(props);
        this.state = { showContent: props.isExpanded };
    }

    public componentWillReceiveProps(newProps, currentProps): void {
        if (newProps.isExpanded !== currentProps.isExpanded) {
            this.setState({ showContent: newProps.isExpanded });
        }
    }

    private onClick = (): void => {
        const { deps, id } = this.props;
        const isHighlightingInteractionSupported = deps.cardInteractionSupport.supportsHighlighting;

        if (isHighlightingInteractionSupported) {
            console.log('here');
            deps.cardSelectionMessageCreator.toggleRuleExpandCollapse(id);
        } else {
            const newState = !this.state.showContent;
            this.setState({ showContent: newState });
        }
    };

    public render(): JSX.Element {
        const { showContent } = this.state;
        const { headingLevel, contentClassName, content, buttonAriaLabel, containerClassName, header } = this.props;

        const containerProps = { role: 'heading', 'aria-level': headingLevel };
        let contentWrapper = null;
        let collapsedCSSClassName = 'collapsed';

        if (showContent) {
            contentWrapper = <div className={css(contentClassName, collapsibleContainerContent)}>{content}</div>;
            collapsedCSSClassName = null;
        }

        return (
            <div className={css(containerClassName, collapsibleContainer, collapsedCSSClassName)}>
                <div {...containerProps}>
                    <ActionButton
                        className={collapsibleControl}
                        onClick={this.onClick}
                        aria-expanded={showContent}
                        ariaLabel={buttonAriaLabel}
                    >
                        <span className={collapsibleTitle}>{header}</span>
                    </ActionButton>
                </div>
                {contentWrapper}
            </div>
        );
    }
}

export const CardsCollapsibleControl = (collapsibleControlProps: CollapsibleComponentCardsProps) => (
    <CollapsibleComponentCards {...collapsibleControlProps} />
);
