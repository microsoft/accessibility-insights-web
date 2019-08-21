// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { FetchScanResultsType } from '../../platform/android/fetch-scan-results';
import { OnConnectedCallback, OnConnectingCallback } from './device-connect-body';

export interface DeviceConnectPortEntryProps {
    needsValidation: boolean;
    onConnectedCallback: OnConnectedCallback;
    onConnectingCallback: OnConnectingCallback;
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
        const onPortTextChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            this.setState({ isValidateButtonDisabled: !newValue || newValue === '', port: newValue });
        };

        return (
            <div className="device-connect-port-entry">
                <h3>Android device port number</h3>
                <MaskedTextField
                    ariaLabel="Port number"
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

    private onValidateClick = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        this.setState({ isValidateButtonDisabled: true });
        this.props.onConnectingCallback();

        await this.props
            .fetchScanResults(parseInt(this.state.port, 10))
            .then(data => {
                this.props.onConnectedCallback(true, `${data.deviceName} - ${data.appIdentifier}`);
            })
            .catch(err => this.props.onConnectedCallback(false));

        this.setState({ isValidateButtonDisabled: false });
    };
}
