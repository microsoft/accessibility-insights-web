// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import Dialog, { DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

export const ScanningDialog = NamedFC('ScanningDialog', () => {
    return (
        <Dialog
            dialogContentProps={{
                type: DialogType.normal,
                showCloseButton: false,
                title: 'Scanning',
            }}
            modalProps={{
                isBlocking: true,
                className: 'scanning-dialog-modal',
            }}
            hidden={false}
        >
            <Spinner size={SpinnerSize.large} />
        </Dialog>
    );
});
