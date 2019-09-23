// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { FetchScanResultsType } from '../../platform/android/fetch-scan-results';
import { DeviceConnectState, UpdateStateCallback } from './device-connect-body';

export type DeviceConnectPortEntryDeps = {
    updateStateCallback: UpdateStateCallback;
    fetchScanResults: FetchScanResultsType;
};

export interface DeviceConnectPortEntryProps {
    deps?: DeviceConnectPortEntryDeps;
    needsValidation: boolean;
    updateStateCallback: UpdateStateCallback;
    fetchScanResults: FetchScanResultsType;
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
        this.props.deps.updateStateCallback(DeviceConnectState.Default);
    };

    private onValidateClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        this.setState({ isValidateButtonDisabled: true });
        this.props.deps.updateStateCallback(DeviceConnectState.Connecting);

        await this.props.deps
            .fetchScanResults(parseInt(this.state.port, 10))
            .then(data => {
                this.props.deps.updateStateCallback(DeviceConnectState.Connected, `${data.deviceName} - ${data.appIdentifier}`);
            })
            .catch(err => this.props.deps.updateStateCallback(DeviceConnectState.Error));

        this.setState({ isValidateButtonDisabled: false });
    };
}
