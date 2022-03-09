// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, IDialogProps } from '@fluentui/react';
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export type BlockingDialogProps = IDialogProps;

export const BlockingDialog = NamedFC<BlockingDialogProps>('BlockingDialog', props => {
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
                // Be warned that changing this value can change which child element is focused by default;
                // we saw this in a reverted experiment that tried using this component in the implementation
                // of telemetry-permission-dialog. Be sure to test the default focus behavior specifically
                // once we change this back to true.
                isBlocking: false,
                onDismiss: undefined,
            }}
        />
    );
});
