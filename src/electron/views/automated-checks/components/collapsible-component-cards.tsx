// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import {
    collapsibleContainer,
    collapsibleContainerContent,
    collapsibleControl,
    collapsibleTitle,
} from 'common/components/cards/collapsible-component-cards.scss';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export interface CollapsibleComponentProps {
    header: JSX.Element;
    content: JSX.Element;
    contentClassName?: string;
    containerClassName?: string;
    headingLevel: number;
}

interface CollapsibleComponentState {
    showContent: boolean;
}

class CollapsibleComponent extends React.Component<CollapsibleComponentProps, CollapsibleComponentState> {
    constructor(props: CollapsibleComponentProps) {
        super(props);
        this.state = { showContent: true };
    }

    private onClick = (): void => {
        const newState = !this.state.showContent;
        this.setState({ showContent: newState });
    };

    public render(): JSX.Element {
        const { showContent } = this.state;

        const { headingLevel, contentClassName, header, containerClassName, content } = this.props;

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
                    <ActionButton className={collapsibleControl} onClick={this.onClick} aria-expanded={showContent}>
                        <span className={collapsibleTitle}>{header}</span>
                    </ActionButton>
                </div>
                {contentWrapper}
            </div>
        );
    }
}

export const CollapsibleComponentCard = (collapsibleControlProps: CollapsibleComponentProps) => (
    <CollapsibleComponent {...collapsibleControlProps} />
);
