// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ProgressIndicator } from 'office-ui-fabric-react';
import Dialog, { DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';
import { scanningDialogModal } from './scanning-dialog.scss';

export const ScanningDialog = NamedFC('ScanningDialog', () => {
    return (
        <Dialog
            dialogContentProps={{
                type: DialogType.normal,
                showCloseButton: false,
            }}
            modalProps={{
                isBlocking: true,
                className: scanningDialogModal,
            }}
            hidden={false}
        >
            <ProgressIndicator label="Scanning" />
        </Dialog>
    );
});
