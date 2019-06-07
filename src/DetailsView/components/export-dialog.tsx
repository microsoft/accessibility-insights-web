// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { WindowUtils } from 'src/common/window-utils';
import { NamedSFC } from '../../common/react/named-sfc';
import { ExportResultType } from '../../common/telemetry-events';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';

export interface ExportDialogProps {
    deps: ExportDialogDeps;
    isOpen: boolean;
    fileName: string;
    description: string;
    html: string;
    onClose: () => void;
    onDescriptionChange: (value: string) => void;
    exportResultsType: ExportResultType;
}

export interface ExportDialogDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    windowUtils: WindowUtils;
}

export const ExportDialog = NamedSFC<ExportDialogProps>('ExportDialog', props => {
    const onDismiss = (): void => {
        props.onClose();
    };

    const onExportLinkClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        const { detailsViewActionMessageCreator } = props.deps;
        detailsViewActionMessageCreator.exportResultsClicked(props.exportResultsType, props.html, event);
        props.onClose();
    };

    const onDescriptionChange = (event, value: string): void => {
        props.onDescriptionChange(value);
    };

    const blob = new Blob([props.html], { type: 'text/html' });
    const blobURL = props.deps.windowUtils.createObjectURL(blob);

    return (
        <Dialog
            hidden={!props.isOpen}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Provide result description',
                subText: 'Optional: please describe the result (it will be saved in the report).',
            }}
            modalProps={{
                isBlocking: false,
                containerClassName: 'insights-dialog-main-override',
            }}
        >
            <TextField
                multiline
                autoFocus
                rows={8}
                resizable={false}
                onChange={onDescriptionChange}
                value={props.description}
                ariaLabel="Provide result description"
            />
            <DialogFooter>
                <PrimaryButton onClick={onExportLinkClick} download={props.fileName} href={blobURL}>
                    Export
                </PrimaryButton>
            </DialogFooter>
        </Dialog>
    );
});
