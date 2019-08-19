// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { OnConnectedCallback, OnConnectingCallback } from './device-connect-body';

export interface DeviceConnectPortEntryProps {
    needsValidation: boolean;
    onConnectedCallback: OnConnectedCallback;
    onConnectingCallback: OnConnectingCallback;
}
export interface DeviceConnectPortEntryState {
    isValidateButtonDisabled: boolean;
}

export class DeviceConnectPortEntry extends React.Component<DeviceConnectPortEntryProps, DeviceConnectPortEntryState> {
    constructor(props: DeviceConnectPortEntryProps) {
        super(props);
        this.state = { isValidateButtonDisabled: true };
    }

    public render(): JSX.Element {
        const onPortTextChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            this.setState({ isValidateButtonDisabled: !newValue || newValue === '' });
        };

        return (
            <div className="device-connect-port-entry">
                <h3>Android device port number</h3>
                <MaskedTextField
                    aria-label="Port number"
                    onChange={onPortTextChanged}
                    placeholder="12345"
                    className="port-number-field"
                    maskChar=""
                    mask="99999"
                />
                <Button
                    primary={this.props.needsValidation}
                    disabled={this.state.isValidateButtonDisabled}
                    className="button-validate-port"
                    onClick={this.onValidateClick}
                >
                    Validate port number
                </Button>
            </div>
        );
    }

    private onValidateClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.setState({ isValidateButtonDisabled: true });
        this.props.onConnectingCallback();
        setTimeout(() => {
            this.props.onConnectedCallback(true, 'Android emulator - Wildlife manager');
            this.setState({ isValidateButtonDisabled: false });
        }, 2000);
    };
}
