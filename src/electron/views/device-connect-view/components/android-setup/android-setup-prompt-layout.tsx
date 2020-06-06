// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DefaultButton, IButtonProps, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './android-setup-prompt-layout.scss';

export type AndroidSetupPromptFooterButtonProps = IButtonProps;
export type AndroidSetupPromptLayoutProps = {
    headerText: string;
    moreInfoLink?: JSX.Element;
    children?: JSX.Element | JSX.Element[];
    leftFooterButtonProps: AndroidSetupPromptFooterButtonProps;
    rightFooterButtonProps: AndroidSetupPromptFooterButtonProps;
};

export const AndroidSetupPromptLayout = NamedFC<AndroidSetupPromptLayoutProps>(
    'AndroidSetupPromptLayout',
    props => {
        const renderOptionalMoreInfoLink = (renderedLink?: JSX.Element) => {
            return renderedLink == null ? null : (
                <div className={styles.promptMoreInfo}>{renderedLink}</div>
            );
        };

        return (
            <div className={styles.promptLayout}>
                <h1 className={styles.promptHeader}>{props.headerText}</h1>
                {renderOptionalMoreInfoLink(props.moreInfoLink)}
                <div className={styles.promptContent}>{props.children}</div>
                <footer className={styles.promptFooter}>
                    <DefaultButton {...props.leftFooterButtonProps} />
                    <PrimaryButton {...props.rightFooterButtonProps} />
                </footer>
            </div>
        );
    },
);
