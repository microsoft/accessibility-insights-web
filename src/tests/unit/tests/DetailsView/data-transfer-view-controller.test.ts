// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AsyncAction } from 'common/flux/async-action';
import { DataTransferViewActions } from 'DetailsView/components/tab-stops/data-transfer-view-actions';
import { DataTransferViewController } from 'DetailsView/data-transfer-view-controller';
import { IMock, Mock, Times } from 'typemoq';

describe('DataTransferViewController', () => {
    let actionMock: IMock<AsyncAction<void>>;
    beforeEach(() => {
        actionMock = Mock.ofType<AsyncAction<void>>();
    });

    test('showQuickAssessToAssessmentConfirmDialog', async () => {
        const actionsStub = {
            showQuickAssessToAssessmentConfirmDialog: actionMock.object,
        } as DataTransferViewActions;
        const testSubject = new DataTransferViewController(actionsStub);
        await testSubject.showQuickAssessToAssessmentConfirmDialog();
        actionMock.verify(m => m.invoke(), Times.once());
    });

    test('hideQuickAssessToAssessmentConfirmDialog', async () => {
        const actionsStub = {
            hideQuickAssessToAssessmentConfirmDialog: actionMock.object,
        } as DataTransferViewActions;
        const testSubject = new DataTransferViewController(actionsStub);
        await testSubject.hideQuickAssessToAssessmentConfirmDialog();
        actionMock.verify(m => m.invoke(), Times.once());
    });
});
