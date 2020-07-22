// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { NamedFC } from 'common/react/named-fc';
import {
    leftFooterButtonAutomationId,
    moreInfoLinkAutomationId,
    rightFooterButtonAutomationId,
} from 'electron/views/device-connect-view/components/automation-ids';
import { DefaultButton, IButtonProps, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './android-setup-step-layout.scss';

export type AndroidSetupFooterButtonProps = IButtonProps;
export type AndroidSetupStepLayoutProps = {
    headerText?: string;
    moreInfoLink?: JSX.Element;
    children?: JSX.Element | JSX.Element[];
    contentClassName?: string;
    leftFooterButtonProps: AndroidSetupFooterButtonProps;
    rightFooterButtonProps: AndroidSetupFooterButtonProps;
};

export const AndroidSetupStepLayout = NamedFC<AndroidSetupStepLayoutProps>(
    'AndroidSetupStepLayout',
    props => {
        const optionalHeader =
            props.headerText == null ? null : <h1 className={styles.header}>{props.headerText}</h1>;

        const optionalMoreInfoLink =
            props.moreInfoLink == null ? null : (
                <div className={styles.moreInfoLink} data-automation-id={moreInfoLinkAutomationId}>
                    {props.moreInfoLink}
                </div>
            );

        return (
            <main className={styles.layoutContainer}>
                {optionalHeader}
                {optionalMoreInfoLink}
                <div className={css(styles.content, props.contentClassName)}>{props.children}</div>
                <div className={styles.footer}>
                    <DefaultButton
                        {...props.leftFooterButtonProps}
                        data-automation-id={leftFooterButtonAutomationId}
                    />
                    <PrimaryButton
                        {...props.rightFooterButtonProps}
                        data-automation-id={rightFooterButtonAutomationId}
                    />
                </div>
            </main>
        );
    },
);
