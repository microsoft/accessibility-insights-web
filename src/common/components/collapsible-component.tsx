// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as styles from 'common/components/collapsible-component.scss';
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
        this.setState(prevState => ({ showContent: !prevState.showContent }));
    };

    public render(): JSX.Element {
        const showContent = this.state.showContent;
        let iconName = this.iconNameUp;
        let content: JSX.Element | null = null;

        if (showContent) {
            iconName = this.iconNameDown;
            content = (
                <div className={css(this.props.contentClassName, styles.collapsibleContent)}>
                    {this.props.content}
                </div>
            );
        }

        return (
            <div className={css(this.props.containerClassName)}>
                <ActionButton
                    className={styles.collapsible}
                    iconProps={{ iconName: iconName }}
                    onClick={this.onClick}
                    aria-expanded={showContent}
                >
                    <span className={styles.collapsibleTitle}>{this.props.header}</span>
                </ActionButton>
                {content}
            </div>
        );
    }
}
