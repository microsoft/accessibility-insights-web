// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { isEmpty } from 'lodash';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';

export interface ActionAndCancelButtonsComponentProps {
    isHidden: boolean;
    primaryButtonDisabled: boolean;
    primaryButtonText: string;
    primaryButtonOnClick: (ev) => void;
    cancelButtonOnClick: (ev) => void;
    primaryButtonHref?: string;
}

export class ActionAndCancelButtonsComponent extends React.Component<ActionAndCancelButtonsComponentProps> {
    public render(): JSX.Element {
        return (
            <div className="action-and-cancel-buttons-component" hidden={this.props.isHidden}>
                <div className="button action-cancel-button-col">
                    <DefaultButton text={'Cancel'} onClick={this.props.cancelButtonOnClick} />
                </div>
                <div className="button action-cancel-button-col">
                    <DefaultButton
                        primary={true}
                        text={this.props.primaryButtonText}
                        onClick={this.props.primaryButtonOnClick}
                        disabled={this.props.primaryButtonDisabled}
                        href={this.props.primaryButtonHref}
                        target={isEmpty(this.props.primaryButtonHref) ? '_self' : '_blank'}
                    />
                </div>
            </div>
        );
    }
}
