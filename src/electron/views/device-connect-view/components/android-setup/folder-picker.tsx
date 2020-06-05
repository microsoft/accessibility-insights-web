// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './folder-picker-text-field.scss';

export type ShowOpenDialog = (
    opts: Electron.OpenDialogOptions,
) => Promise<Electron.OpenDialogReturnValue>;

export type FolderPickerDeps = {
    showOpenDialog: ShowOpenDialog;
};

export type FolderPickerProps = {
    deps: FolderPickerDeps;
    value: string;
    onChange: (newValue?: string) => void;
};

export const FolderPicker = NamedFC<FolderPickerProps>(
    'FolderPicker',
    (props: FolderPickerProps) => {
        const onTextFieldChange = (_, newValue) => {
            props.onChange(newValue);
        };

        const onBrowseDialogComplete = (result: Electron.OpenDialogReturnValue) => {
            if (result.filePaths.length >= 1) {
                props.onChange(result.filePaths[0]);
            }
        };

        const onBrowseButtonClick = () => {
            // To be implemented in later feature work
            props.deps
                .showOpenDialog({
                    properties: ['openDirectory'],
                })
                .then(onBrowseDialogComplete)
                .catch(console.error);
        };

        return (
            <div className={styles.folderPicker}>
                <TextField
                    className={styles.textField}
                    iconProps={{ iconName: 'FabricFolder' }}
                    placeholder="Type a path..."
                    value={props.value}
                    onChange={onTextFieldChange}
                />
                <PrimaryButton
                    className={styles.browseButton}
                    text="Browse"
                    onClick={onBrowseButtonClick}
                />
            </div>
        );
    },
);
