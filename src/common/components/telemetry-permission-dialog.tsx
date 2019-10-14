// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigurationActionCreator } from 'background/global-action-creators/types/user-configuration-action-creator';
import { telemetryPopupCheckboxTitle, telemetryPopupTitle } from 'content/settings/improve-accessibility-insights';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
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

export type TelemetryPermissionDialogDeps = {
    userConfigMessageCreator: UserConfigurationActionCreator;
} & TelemetryNoticeDeps &
    PrivacyStatementTextDeps;

export class TelemetryPermissionDialog extends React.Component<TelemetryPermissionDialogProps, TelemetryPermissionDialogState> {
    constructor(props) {
        super(props);
        this.state = {
            isEnableTelemetryChecked: true,
        };
    }

    public render(): JSX.Element {
        if (!this.props.isFirstTime) {
            return null;
        }
        return (
            <Dialog
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: telemetryPopupTitle,
                    titleId: 'telemetry-permission-title',
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
                            this.props.deps.userConfigMessageCreator.setTelemetryState({
                                enableTelemetry: this.state.isEnableTelemetryChecked,
                            })
                        }
                    />
                </DialogFooter>
            </Dialog>
        );
    }

    private onCheckboxChange = (ev?, checked?: boolean): void => {
        this.setState({ isEnableTelemetryChecked: checked });
    };
}
