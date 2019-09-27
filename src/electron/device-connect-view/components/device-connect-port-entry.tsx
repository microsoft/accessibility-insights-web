// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { DeviceConnectActionCreator } from '../../flux/action-creator/device-connect-action-creator';

export type DeviceConnectPortEntryDeps = {
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface DeviceConnectPortEntryProps {
    deps: DeviceConnectPortEntryDeps;
    needsValidation: boolean;
}

export interface DeviceConnectPortEntryState {
    isValidateButtonDisabled: boolean;
    port: string;
}

export class DeviceConnectPortEntry extends React.Component<DeviceConnectPortEntryProps, DeviceConnectPortEntryState> {
    constructor(props: DeviceConnectPortEntryProps) {
        super(props);
        this.state = { isValidateButtonDisabled: true, port: '' };
    }

    public render(): JSX.Element {
        return (
            <div className="device-connect-port-entry">
                <h3>Android device port number</h3>
                <MaskedTextField
                    ariaLabel="Port number"
                    onChange={this.onPortTextChanged}
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

    private onPortTextChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        this.setState({ isValidateButtonDisabled: !newValue || newValue === '', port: newValue });
    };

    private onValidateClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const port = parseInt(this.state.port, 10);
        this.props.deps.deviceConnectActionCreator.validatePort(port);
    };
}
