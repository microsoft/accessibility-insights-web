// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import * as React from 'react';

import { BugFilingServiceProvider } from '../../bug-filing/bug-filing-service-provider';
import { NamedSFC } from '../../common/react/named-sfc';

export interface IssueFilingDialogProps {
    deps: IssueFilingDialogDeps;
    isOpen: boolean;
    onClose: () => void;
}

export interface IssueFilingDialogDeps {
    bugFilingServiceProvider: BugFilingServiceProvider;
}

const titleLabel = 'Specify issue filing location';

export const IssueFilingDialog = NamedSFC<IssueFilingDialogProps>('IssueFilingDialog', props => {
    return (
        <Dialog
            className={'issue-filing-dialog'}
            hidden={!props.isOpen}
            onDismiss={props.onClose}
            dialogContentProps={{
                type: DialogType.normal,
                title: titleLabel,
                titleId: 'issue-filing-dialog-title',
                subText: 'This configuration can be changed again in settings.',
                subTextId: 'issue-filing-dialog-subtext',
                showCloseButton: false,
            }}
            modalProps={{
                isBlocking: false,
                containerClassName: 'insights-dialog-main-override',
            }}
        >
            <DialogFooter />
        </Dialog>
    );
});
