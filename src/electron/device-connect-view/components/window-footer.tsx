// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

export interface WindowFooterProps {
    cancelClick: () => void;
    canStartTesting: boolean;
}

export const WindowFooter = NamedSFC<WindowFooterProps>('WindowFooter', (props: WindowFooterProps) => {
    const onCancelClick = () => props.cancelClick();
    return (
        <footer className="window-footer">
            <DefaultButton className="window-footer-button-cancel" onClick={onCancelClick} text="Cancel"></DefaultButton>
            <PrimaryButton className="window-footer-button-start" disabled={!props.canStartTesting} text="Start testing"></PrimaryButton>
        </footer>
    );
});
