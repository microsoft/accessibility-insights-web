// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from '@fluentui/react';
import { isEmpty } from 'lodash';
import * as React from 'react';

import styles from './action-and-cancel-buttons-component.scss';

export interface ActionAndCancelButtonsComponentProps {
    isHidden: boolean;
    primaryButtonDisabled: boolean;
    primaryButtonText: string;
    primaryButtonOnClick: (ev) => void;
    cancelButtonOnClick: (ev) => void;
    primaryButtonHref?: string;
    primaryButtonDataAutomationId?: string;
}

export class ActionAndCancelButtonsComponent extends React.Component<ActionAndCancelButtonsComponentProps> {
    public render(): JSX.Element {
        return (
            <div className={styles.actionAndCancelButtonsComponent} hidden={this.props.isHidden}>
                <div className={styles.actionCancelButtonCol}>
                    <DefaultButton text={'Cancel'} onClick={this.props.cancelButtonOnClick} />
                </div>
                <div className={styles.actionCancelButtonCol}>
                    <DefaultButton
                        data-automation-id={this.props.primaryButtonDataAutomationId}
                        primary={true}
                        text={this.props.primaryButtonText}
                        onClick={this.props.primaryButtonOnClick}
                        disabled={this.props.primaryButtonDisabled}
                        href={this.props.primaryButtonHref}
                        target={isEmpty(this.props.primaryButtonHref) ? '_self' : '_blank'}
                    />
                </div>
            </div>
        );
    }
}