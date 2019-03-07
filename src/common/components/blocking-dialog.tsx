// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType, IDialogProps } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';

export type BlockingDialogProps = IDialogProps;

export const BlockingDialog = NamedSFC<BlockingDialogProps>('BlockingDialog', props => {
    return (
        // As of writing, NVDA has an issue where it doesn't announce new elements with role=alertdialog,
        // which Office Fabric applies implicitly whenever isBlocking: true is set. As a workaround, our
        // "blocking" dialog sets isBlocking: false (which means the dialog will use role=dialog instead of
        // role=alertdialog, which NVDA announces more reliably), and emulates being "blocking" by making
        // sure we don't set any onDismiss handlers and overriding showCloseButton to false.
        <Dialog
            {...props}
            onDismiss={undefined}
            dialogContentProps={{
                ...props.dialogContentProps,
                showCloseButton: false,
            }}
            modalProps={{
                ...props.modalProps,
                // Be warned that changing this value can change which child element is focused by default
                // (we saw this in the telemetry-permission-dialog); be sure to test this behavior specifically
                // if you ever change this back to true.
                isBlocking: false,
                onDismiss: undefined,
            }}
        />
    );
});
