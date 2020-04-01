// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { KeyCodeConstants } from 'common/constants/keycode-constants';
import { DefaultButton, MaskedTextField, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';

import { DeviceConnectActionCreator } from '../../../flux/action-creator/device-connect-action-creator';
import { DeviceConnectState } from '../../../flux/types/device-connect-state';
import * as styles from './device-connect-port-entry.scss';

export const deviceConnectPortNumberFieldAutomationId = 'device-connect-port-number-field';
export const deviceConnectValidatePortButtonAutomationId = 'device-connect-validate-port-button';

export type DeviceConnectPortEntryViewState = {
    deviceConnectState: DeviceConnectState;
};

export type DeviceConnectPortEntryDeps = {
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface DeviceConnectPortEntryProps {
    deps: DeviceConnectPortEntryDeps;
    viewState: DeviceConnectPortEntryViewState;
}

export interface DeviceConnectPortEntryState {
    port: string;
}

const textFieldId = 'port-number-text-field-id';

export class DeviceConnectPortEntry extends React.Component<
    DeviceConnectPortEntryProps,
    DeviceConnectPortEntryState
> {
    constructor(props: DeviceConnectPortEntryProps) {
        super(props);
        this.state = { port: '' };
    }

    public render(): JSX.Element {
        return (
            <div className={styles.deviceConnectPortEntry}>
                <label htmlFor={textFieldId} className={styles.portNumberLabel}>
                    Android device port number
                </label>
                <div className={styles.deviceConnectPortEntryBody}>
                    <MaskedTextField
                        id={textFieldId}
                        data-automation-id={deviceConnectPortNumberFieldAutomationId}
                        onChange={this.onPortTextChanged}
                        placeholder="Ex: 12345"
                        className={styles.portNumberField}
                        maskChar=""
                        mask="99999"
                        onKeyDown={this.onEnterKey}
                        onRenderDescription={() => (
                            <span className={styles.portNumberFieldDescription}>
                                The port number must be between 0 and 65535.
                            </span>
                        )}
                    />
                    {this.renderValidationPortButton()}
                </div>
            </div>
        );
    }

    private renderValidationPortButton(): JSX.Element {
        const props = {
            'data-automation-id': deviceConnectValidatePortButtonAutomationId,
            disabled: this.isValidateButtonDisabled(),
            onClick: this.onValidateClick,
        };

        if (this.props.viewState.deviceConnectState !== DeviceConnectState.Connected) {
            return <PrimaryButton {...props}>Validate port number</PrimaryButton>;
        }

        return <DefaultButton {...props}>Validate port number</DefaultButton>;
    }

    private isValidateButtonDisabled(): boolean {
        return (
            !this.state.port ||
            this.state.port === '' ||
            this.props.viewState.deviceConnectState === DeviceConnectState.Connecting
        );
    }

    private onPortTextChanged = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string,
    ) => {
        this.props.deps.deviceConnectActionCreator.resetConnection();
        this.setState({ port: newValue });
    };

    private onValidateClick = (): void => {
        const port = parseInt(this.state.port, 10);
        this.props.deps.deviceConnectActionCreator.validatePort(port);
    };

    private onEnterKey = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.keyCode === KeyCodeConstants.ENTER) {
            this.onValidateClick();
        }
    };
}
