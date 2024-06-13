// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from '@fluentui/react-components';
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
                    <Button
                        className={styles.cancelButton}
                        onClick={this.props.cancelButtonOnClick}
                    >
                        Cancel
                    </Button>
                </div>
                <div className={styles.actionCancelButtonCol}>
                    <Button
                        appearance="primary"
                        className={
                            this.props.primaryButtonDisabled
                                ? styles.actionButtonDisabled
                                : styles.actionButtonEnabled
                        }
                        data-automation-id={this.props.primaryButtonDataAutomationId}
                        onClick={this.props.primaryButtonOnClick}
                        disabled={this.props.primaryButtonDisabled}
                        href={this.props.primaryButtonHref}
                        target={isEmpty(this.props.primaryButtonHref) ? '_self' : '_blank'}
                    >
                        {' '}
                        {this.props.primaryButtonText}{' '}
                    </Button>
                </div>
            </div>
        );
    }
}
