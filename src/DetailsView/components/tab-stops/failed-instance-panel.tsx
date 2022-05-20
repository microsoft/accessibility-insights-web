// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TextField } from '@fluentui/react';
import { ActionAndCancelButtonsComponent } from 'DetailsView/components/action-and-cancel-buttons-component';
import { GenericPanel, GenericPanelProps } from 'DetailsView/components/generic-panel';
import * as React from 'react';
import styles from '../failure-instance-panel.scss';

export interface FailedInstancePanelProps {
    isOpen: boolean;
    instanceDescription: string | null;
    headerText: string;
    confirmButtonText: string;
    onConfirm: () => void;
    onChange: (event: React.SyntheticEvent, description: string) => void;
    onDismiss: () => void;
}

export const addFailedInstanceTextAreaAutomationId: string = 'addFailedInstanceTextArea';
export const primaryAddFailedInstanceButtonAutomationId: string = 'primaryAddFailedInstanceButton';

export class FailedInstancePanel extends React.Component<FailedInstancePanelProps> {
    public render(): JSX.Element {
        const panelProps: GenericPanelProps = {
            isOpen: this.props.isOpen,
            className: styles.failureInstancePanel,
            onDismiss: this.props.onDismiss,
            headerText: this.props.headerText,
            hasCloseButton: true,
            closeButtonAriaLabel: 'Close failure instance panel',
        };

        return (
            <GenericPanel {...panelProps}>
                <TextField
                    data-automation-id={addFailedInstanceTextAreaAutomationId}
                    className={styles.observedFailureTextfield}
                    label="Comment"
                    multiline={true}
                    rows={8}
                    value={this.props.instanceDescription ?? ''}
                    onChange={this.props.onChange}
                    resizable={false}
                    placeholder="Comment"
                />
                {this.getActionCancelButtons()}
            </GenericPanel>
        );
    }

    private getActionCancelButtons = (): JSX.Element => {
        return (
            <div>
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonDataAutomationId={primaryAddFailedInstanceButtonAutomationId}
                    primaryButtonDisabled={this.props.instanceDescription === null}
                    primaryButtonText={this.props.confirmButtonText}
                    primaryButtonOnClick={() => {
                        this.props.onConfirm();
                        this.props.onDismiss();
                    }}
                    cancelButtonOnClick={this.props.onDismiss}
                />
            </div>
        );
    };
}
