// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { DeviceConnectActionCreator } from '../../flux/action-creator/device-connect-action-creator';
import { FetchScanResultsType } from '../../platform/android/fetch-scan-results';
import { UpdateStateCallback } from './device-connect-body';
import { DeviceConnectState } from './device-connect-state';

export type DeviceConnectPortEntryDeps = {
    fetchScanResults: FetchScanResultsType;
    deviceConnectActionCreator: DeviceConnectActionCreator;
};

export interface DeviceConnectPortEntryProps {
    deps: DeviceConnectPortEntryDeps;
    needsValidation: boolean;
    updateStateCallback: UpdateStateCallback;
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
        this.props.updateStateCallback(DeviceConnectState.Default);
    };

    private onValidateClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        this.setState({ isValidateButtonDisabled: true });

        const port = parseInt(this.state.port, 10);

        this.props.deps.deviceConnectActionCreator.validatePort(port);
        this.props.updateStateCallback(DeviceConnectState.Connecting);

        await this.props.deps
            .fetchScanResults(port)
            .then(data => {
                this.props.updateStateCallback(DeviceConnectState.Connected, `${data.deviceName} - ${data.appIdentifier}`);
            })
            .catch(err => this.props.updateStateCallback(DeviceConnectState.Error));

        this.setState({ isValidateButtonDisabled: false });
    };
}
