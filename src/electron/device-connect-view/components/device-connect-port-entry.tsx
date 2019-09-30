// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { DeviceConnectActionCreator } from '../../flux/action-creator/device-connect-action-creator';
import { DeviceConnectState } from './device-connect-state';

export type DeviceConnectPortEntryViewState = {
    deviceConnectState: DeviceConnectState;
};

export type DeviceConnectPortEntryDeps = {
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface DeviceConnectPortEntryProps {
    deps: DeviceConnectPortEntryDeps;
    needsValidation: boolean;
    viewState: DeviceConnectPortEntryViewState;
}

export interface DeviceConnectPortEntryState {
    port: string;
}

export class DeviceConnectPortEntry extends React.Component<DeviceConnectPortEntryProps, DeviceConnectPortEntryState> {
    constructor(props: DeviceConnectPortEntryProps) {
        super(props);
        this.state = { port: '' };
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
                    disabled={this.isValidateButtonDisabled()}
                    className="button-validate-port"
                    onClick={this.onValidateClick}
                >
                    Validate port number
                </Button>
            </div>
        );
    }

    private isValidateButtonDisabled(): boolean {
        return !this.state.port || this.state.port === '' || this.props.viewState.deviceConnectState === DeviceConnectState.Connecting;
    }

    private onPortTextChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        this.setState({ port: newValue });
    };

    private onValidateClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        const port = parseInt(this.state.port, 10);
        this.props.deps.deviceConnectActionCreator.validatePort(port);
    };
}
