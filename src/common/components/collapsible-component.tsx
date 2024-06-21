// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from '@fluentui/react';
import { Button, themeToTokensObject, webLightTheme } from '@fluentui/react-components';
import { css } from '@fluentui/utilities';
import styles from 'common/components/collapsible-component.scss';
import * as React from 'react';
import { ChevronDown24Regular, ChevronRight24Regular } from '@fluentui/react-icons';

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
                {/* 111<ActionButton
                    className={styles.collapsible}
                    iconProps={{ iconName: iconName }}
                    onClick={this.onClick}
                    aria-expanded={showContent}
                >
                    {this.props.header}
                </ActionButton> */}
                <Button className={styles.collapsible} appearance='transparent'
                    onClick={this.onClick}
                    aria-expanded={showContent}>
                    {showContent ? (
                        <ChevronDown24Regular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} className={styles.collapsible} />
                    ) : (
                        <ChevronRight24Regular color={themeToTokensObject(webLightTheme).colorCompoundBrandStrokeHover} className={styles.collapsible} />
                    )}
                    111
                    {this.props.header}
                </Button>
                {content}
            </div>
        );
    }
}
