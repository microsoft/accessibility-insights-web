// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import { getId, PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './folder-picker.scss';

export type FolderPickerDeps = {
    showOpenFileDialog: (opts: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
};
export type FolderPickerProps = {
    deps: FolderPickerDeps;
    instructionsText: string;
    value: string;
    onChange: (newValue?: string) => void;
};

export const FolderPicker = NamedFC<FolderPickerProps>(
    'FolderPicker',
    (props: FolderPickerProps) => {
        const onTextFieldChange = (_, newValue) => {
            props.onChange(newValue);
        };

        const onBrowseButtonClick = async () => {
            const result = await props.deps.showOpenFileDialog({
                properties: ['openDirectory'],
            });

            if (!result.canceled && result.filePaths.length > 0) {
                props.onChange(result.filePaths[0]);
            }
        };

        const instructionsId = getId('folder-picker-instructions__');

        return (
            <div className={styles.folderPicker}>
                <p id={instructionsId} className={styles.instructions}>
                    {props.instructionsText}
                </p>
                <div className={styles.pickerControl}>
                    <TextField
                        placeholder="adb path"
                        ariaLabel="Enter a path"
                        aria-describedby={instructionsId}
                        className={styles.textField}
                        iconProps={{ iconName: 'FabricFolder' }}
                        value={props.value}
                        onChange={onTextFieldChange}
                    />
                    <PrimaryButton
                        className={styles.browseButton}
                        text="Browse"
                        onClick={onBrowseButtonClick}
                    />
                </div>
            </div>
        );
    },
);
