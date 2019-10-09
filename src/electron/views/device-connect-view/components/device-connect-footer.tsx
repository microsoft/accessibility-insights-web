// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { NamedFC } from '../../../../common/react/named-fc';
import { deviceConnectFooter, footerButtonCancel, footerButtonStart } from './device-connect-footer.scss';

export interface DeviceConnectFooterDeps {
    windowStateActionCreator: WindowStateActionCreator;
}

export interface DeviceConnectFooterProps {
    cancelClick: () => void;
    canStartTesting: boolean;
    deps: DeviceConnectFooterDeps;
}

export const DeviceConnectFooter = NamedFC<DeviceConnectFooterProps>('DeviceConnectFooter', (props: DeviceConnectFooterProps) => {
    const onCancelClick = () => props.cancelClick();
    return (
        <footer className={deviceConnectFooter}>
            <DefaultButton className={footerButtonCancel} onClick={onCancelClick} text="Cancel"></DefaultButton>
            <PrimaryButton
                className={footerButtonStart}
                onClick={() => {
                    props.deps.windowStateActionCreator.setRoute({ routeId: 'resultsView' });
                }}
                disabled={!props.canStartTesting}
                text="Start testing"
            ></PrimaryButton>
        </footer>
    );
});
