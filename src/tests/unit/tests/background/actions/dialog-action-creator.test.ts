// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DialogActionCreator } from 'background/actions/dialog-action-creator';
import { DialogActions } from 'background/actions/dialog-actions';
import { Messages } from 'common/messages';
import { createAsyncActionMock } from 'tests/unit/tests/background/global-action-creators/action-creator-test-helpers';
import { MockInterpreter } from 'tests/unit/tests/background/global-action-creators/mock-interpreter';
import { IMock, Mock } from 'typemoq';

describe(DialogActionCreator, () => {
    let interpreterMock: MockInterpreter;

    beforeEach(() => {
        interpreterMock = new MockInterpreter();
    });

    it('handles openIssueFilingSettingsDialog message', async () => {
        const actionMock = createAsyncActionMock(null);
        const dialogActionsMock = createActionsMock(
            'openIssueFilingSettingsDialog',
            actionMock.object,
        );

        const testSubject = new DialogActionCreator(
            interpreterMock.object,
            dialogActionsMock.object,
        );
        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Dialog.openIssueFilingSettingsDialog, null);

        actionMock.verifyAll();
    });

    it('handles closeIssueFilingSettingsDialog message', async () => {
        const actionMock = createAsyncActionMock(null);
        const dialogActionsMock = createActionsMock(
            'closeIssueFilingSettingsDialog',
            actionMock.object,
        );

        const testSubject = new DialogActionCreator(
            interpreterMock.object,
            dialogActionsMock.object,
        );
        testSubject.registerCallbacks();

        await interpreterMock.simulateMessage(Messages.Dialog.closeIssueFilingSettingsDialog, null);

        actionMock.verifyAll();
    });

    function createActionsMock<ActionName extends keyof DialogActions>(
        actionName: ActionName,
        action: DialogActions[ActionName],
    ): IMock<DialogActions> {
        const actionsMock = Mock.ofType<DialogActions>();
        actionsMock.setup(actions => actions[actionName]).returns(() => action);
        return actionsMock;
    }
});
