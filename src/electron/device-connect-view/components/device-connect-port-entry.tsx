// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Button } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

export interface DeviceConnectPortEntryProps {
    NeedsValidation: boolean;
}
export interface DeviceConnectPortEntryState {
    IsValidateButtonDisabled: boolean;
}

export class DeviceConnectPortEntry extends React.Component<DeviceConnectPortEntryProps, DeviceConnectPortEntryState> {
    constructor(props: DeviceConnectPortEntryProps) {
        super(props);
        this.state = { IsValidateButtonDisabled: true };
    }

    public render(): JSX.Element {
        const onPortTextChanged = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            this.setState({ IsValidateButtonDisabled: !newValue || newValue === '' });
        };

        return (
            <div className="device-connect-port-entry">
                <h3>Android device port number</h3>
                <TextField onChange={onPortTextChanged} placeholder="12345" className="port-number-field" />
                <Button primary={this.props.NeedsValidation} disabled={this.state.IsValidateButtonDisabled}>
                    Validate port number
                </Button>
            </div>
        );
    }
}
