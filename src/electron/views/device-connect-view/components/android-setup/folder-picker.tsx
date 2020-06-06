// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './folder-picker.scss';

export type FolderPickerProps = {
    value: string;
    onChange: (newValue?: string) => void;
};

export const FolderPicker = NamedFC<FolderPickerProps>(
    'FolderPicker',
    (props: FolderPickerProps) => {
        const onTextFieldChange = (_, newValue) => {
            props.onChange(newValue);
        };

        const onBrowseButtonClick = () => {
            // To be implemented in terms of Electron.dialog.showOpenDialog in later feature work
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
