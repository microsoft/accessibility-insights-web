// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
import { ChevronDownRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { css } from '@fluentui/utilities';
import styles from 'common/components/collapsible-component.scss';
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
    constructor(props: CollapsibleComponentProps) {
        super(props);
        this.state = { showContent: true };
    }

    private onClick = (): void => {
        this.setState(prevState => ({ showContent: !prevState.showContent }));
    };

    public render(): JSX.Element {
        const showContent = this.state.showContent;
        let content: JSX.Element | null = null;

        if (showContent) {
            content = (
                <div className={css(this.props.contentClassName, styles.collapsibleContent)}>
                    {this.props.content}
                </div>
            );
        }

        return (
            <div className={css(this.props.containerClassName)}>
                <Button
                    appearance="transparent"
                    className={styles.collapsible}
                    onClick={this.onClick}
                    aria-expanded={showContent}
                >
                    {showContent ? (
                        <ChevronDownRegular className={styles.collapsible} />
                    ) : (
                        <ChevronRightRegular className={styles.collapsible} />
                    )}
                    {this.props.header}
                </Button>
                {content}
            </div>
        );
    }
}
