// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from '@fluentui/react';
import { Checkbox } from '@fluentui/react';
import { Dialog, DialogFooter, DialogType } from '@fluentui/react';
import {
    telemetryPopupCheckboxTitle,
    telemetryPopupTitle,
} from 'content/settings/improve-accessibility-insights';
import * as React from 'react';
import { PrivacyStatementPopupText, PrivacyStatementTextDeps } from './privacy-statement-text';
import { TelemetryNotice, TelemetryNoticeDeps } from './telemetry-notice';

export interface TelemetryPermissionDialogState {
    isEnableTelemetryChecked: boolean;
}

export interface TelemetryPermissionDialogProps {
    deps: TelemetryPermissionDialogDeps;
    isFirstTime: boolean;
}

export type SetTelemetryStateMessageCreator = {
    setTelemetryState: (enableTelemetry: boolean) => void;
};

export type TelemetryPermissionDialogDeps = {
    userConfigMessageCreator: SetTelemetryStateMessageCreator;
} & TelemetryNoticeDeps &
    PrivacyStatementTextDeps;

export class TelemetryPermissionDialog extends React.Component<
    TelemetryPermissionDialogProps,
    TelemetryPermissionDialogState
> {
    constructor(props) {
        super(props);
        this.state = {
            isEnableTelemetryChecked: true,
        };
    }

    public render(): JSX.Element | null {
        if (!this.props.isFirstTime) {
            return null;
        }
        return (
            <Dialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    showCloseButton: false,
                    title: telemetryPopupTitle,
                }}
                modalProps={{
                    className: 'telemetry-permission-dialog-modal',
                    isBlocking: true,
                    containerClassName: 'insights-dialog-main-override telemetry-permission-dialog',
                }}
            >
                <div className="telemetry-permission-details">
                    <TelemetryNotice deps={this.props.deps}></TelemetryNotice>
                </div>
                <div className="telemetry-checkbox-section">
                    <Checkbox
                        label={telemetryPopupCheckboxTitle}
                        onChange={this.onCheckboxChange}
                        checked={this.state.isEnableTelemetryChecked}
                        className="telemetry-agree-checkbox"
                    />
                    <PrivacyStatementPopupText deps={this.props.deps}></PrivacyStatementPopupText>
                </div>
                <DialogFooter>
                    <PrimaryButton
                        className="start-using-product-button"
                        text={`OK`}
                        onClick={() =>
                            this.props.deps.userConfigMessageCreator.setTelemetryState(
                                this.state.isEnableTelemetryChecked,
                            )
                        }
                    />
                </DialogFooter>
            </Dialog>
        );
    }

    private onCheckboxChange = (ev?, checked?: boolean): void => {
        this.setState({ isEnableTelemetryChecked: !!checked });
    };
}
