// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DialogActions } from 'background/actions/dialog-actions';
import { Interpreter } from 'background/interpreter';
import { Messages } from 'common/messages';

export class DialogActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly dialogActions: DialogActions,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Dialog.openIssueFilingSettingsDialog,
            this.openIssueFilingSettingsDialog,
        );
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Dialog.closeIssueFilingSettingsDialog,
            this.closeIssueFilingSettingsDialog,
        );
    }

    private openIssueFilingSettingsDialog = async () => {
        await this.dialogActions.openIssueFilingSettingsDialog.invoke(null);
    };

    private closeIssueFilingSettingsDialog = async () => {
        await this.dialogActions.closeIssueFilingSettingsDialog.invoke(null);
    };
}
