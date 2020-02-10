// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';

export type GenericDialogProps = {
    onPrimaryButtonClick: (event: React.MouseEvent<any>) => void;
    onCancelButtonClick: (event: React.MouseEvent<any>) => void;
    messageText: string;
    title: string;
    primaryButtonText: string;
};

export const GenericDialog = NamedFC<GenericDialogProps>('GenericDialog', props => {
    const {
        onCancelButtonClick,
        onPrimaryButtonClick,
        messageText,
        title,
        primaryButtonText,
    } = props;

    return (
        <Dialog
            hidden={false}
            onDismiss={onCancelButtonClick}
            dialogContentProps={{
                type: DialogType.normal,
                title: title,
                showCloseButton: false,
            }}
            modalProps={{
                isBlocking: false,
                containerClassName: 'insights-dialog-main-override',
            }}
        >
            <div className={'start-over-dialog-body'}>{messageText}</div>
            <DialogFooter>
                <PrimaryButton onClick={onPrimaryButtonClick} text={primaryButtonText} />
                <DefaultButton onClick={onCancelButtonClick} text={'Cancel'} autoFocus={true} />
            </DialogFooter>
        </Dialog>
    );
});
