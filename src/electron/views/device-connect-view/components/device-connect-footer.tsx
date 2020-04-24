// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';

import * as styles from './device-connect-footer.scss';

export const deviceConnectCancelAutomationId = 'device-connect-footer-cancel';
export const deviceConnectStartAutomationId = 'device-connect-footer-start';

export interface DeviceConnectFooterDeps {
    windowStateActionCreator: WindowStateActionCreator;
    windowFrameActionCreator: WindowFrameActionCreator;
}

export interface DeviceConnectFooterProps {
    cancelClick: () => void;
    canStartTesting: boolean;
    deps: DeviceConnectFooterDeps;
}

export const DeviceConnectFooter = NamedFC<DeviceConnectFooterProps>(
    'DeviceConnectFooter',
    (props: DeviceConnectFooterProps) => {
        const onCancelClick = () => props.cancelClick();
        return (
            <footer className={styles.deviceConnectFooter}>
                <DefaultButton
                    data-automation-id={deviceConnectCancelAutomationId}
                    className={styles.footerButtonCancel}
                    onClick={onCancelClick}
                    text="Cancel"
                ></DefaultButton>
                <PrimaryButton
                    data-automation-id={deviceConnectStartAutomationId}
                    className={styles.footerButtonStart}
                    onClick={() => {
                        props.deps.windowStateActionCreator.setRoute({ routeId: 'resultsView' });
                    }}
                    disabled={!props.canStartTesting}
                    text="Start testing"
                ></PrimaryButton>
            </footer>
        );
    },
);
