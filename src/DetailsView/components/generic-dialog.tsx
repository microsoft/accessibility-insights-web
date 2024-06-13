// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, DialogFooter, DialogType } from '@fluentui/react';
import { Button } from '@fluentui/react-components';
import buttonStyles from 'common/styles/button.scss';
import styles from 'DetailsView/components/common-dialog-styles.scss';
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
    const { onCancelButtonClick, onPrimaryButtonClick, messageText, title, primaryButtonText } =
        props;

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
                containerClassName: styles.insightsDialogMainOverride,
            }}
        >
            <div className={styles.dialogBody}>{messageText}</div>
            <DialogFooter>
                <div className={buttonStyles.buttonsComponent}>
                    <div className={buttonStyles.buttonCol}>
                        <Button
                            className={buttonStyles.primaryButtonEnabled}
                            appearance="primary"
                            onClick={onPrimaryButtonClick}
                        >
                            {' '}
                            {primaryButtonText}{' '}
                        </Button>
                    </div>
                    <div className={buttonStyles.buttonCol}>
                        <Button
                            className={buttonStyles.defaultButton}
                            onClick={onCancelButtonClick}
                            autoFocus={true}
                        >
                            {' '}
                            Cancel{' '}
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </Dialog>
    );
});
