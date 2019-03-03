// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export interface ActionAndCancelButtonsComponentProps {
    isHidden: boolean;
    primaryButtonDisabled: boolean;
    primaryButtonText: string;
    primaryButtonOnClick: (ev) => void;
    cancelButtonOnClick: (ev) => void;
}

export class ActionAndCancelButtonsComponent extends React.Component<ActionAndCancelButtonsComponentProps> {
    public render(): JSX.Element {
        return (
            <div className="action-and-cancel-buttons-component" hidden={this.props.isHidden}>
                <div className="button ms-Grid-col ms-sm2 action-cancel-button-col">
                    <DefaultButton
                        primary={true}
                        text={this.props.primaryButtonText}
                        onClick={this.props.primaryButtonOnClick}
                        disabled={this.props.primaryButtonDisabled}
                    />
                </div>
                <div className="button ms-Grid-col ms-sm2 action-cancel-button-col">
                    <DefaultButton text={'Cancel'} onClick={this.props.cancelButtonOnClick} />
                </div>
            </div>
        );
    }
}
