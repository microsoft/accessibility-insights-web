// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { FileURLProvider } from '../../common/file-url-provider';
import { NamedFC } from '../../common/react/named-fc';
import { ExportResultType } from '../../common/extension-telemetry-events';
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
    onExportClick: () => void;
}

export interface ExportDialogDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    fileURLProvider: FileURLProvider;
}

export const ExportDialog = NamedFC<ExportDialogProps>('ExportDialog', props => {
    const onDismiss = (): void => {
        props.onClose();
    };

    const onExportLinkClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        const { detailsViewActionMessageCreator } = props.deps;
        props.onDescriptionChange(props.description);
        detailsViewActionMessageCreator.exportResultsClicked(props.exportResultsType, props.html, event);
        props.onExportClick();
        props.onClose();
    };

    const onDescriptionChange = (event, value: string): void => {
        props.onDescriptionChange(value);
    };

    const fileURL = props.deps.fileURLProvider.provideURL([props.html], 'text/html');

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
                <PrimaryButton onClick={onExportLinkClick} download={props.fileName} href={fileURL}>
                    Export
                </PrimaryButton>
            </DialogFooter>
        </Dialog>
    );
});
