// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Interpreter } from 'background/interpreter';
import { QuickAssessToAssessmentConverter } from 'background/quick-assess-to-assessment-converter';
import { AssessmentStore } from 'background/stores/assessment-store';
import { DataTransferStore } from 'background/stores/global/data-transfer-store';
import { InterpreterMessage } from 'common/message';
import { Messages } from 'common/messages';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DataTransferStoreData } from 'common/types/store-data/data-transfer-store-data';
import { IMock, It, Mock, Times } from 'typemoq';

describe('QuickAssessToAssessmentConverter', () => {
    let dataTransferStoreMock: IMock<DataTransferStore>;
    let quickAssessStoreMock: IMock<AssessmentStore>;
    let interpreterMock: IMock<Interpreter>;
    let testSubject: QuickAssessToAssessmentConverter;
    let onDataTransferStoreChangeCallback: () => Promise<void>;

    beforeEach(() => {
        dataTransferStoreMock = Mock.ofType<DataTransferStore>();
        quickAssessStoreMock = Mock.ofType<AssessmentStore>();
        interpreterMock = Mock.ofType<Interpreter>();

        testSubject = new QuickAssessToAssessmentConverter(
            dataTransferStoreMock.object,
            quickAssessStoreMock.object,
            interpreterMock.object,
        );

        dataTransferStoreMock
            .setup(m => m.addChangedListener(It.isAny()))
            .callback(cb => {
                onDataTransferStoreChangeCallback = cb;
            });

        testSubject.initialize();
    });

    test('initialize: do nothing because quickAssessToAssessmentInitiated is false', async () => {
        setupDataTransferStoreMock({ quickAssessToAssessmentInitiated: false });

        await onDataTransferStoreChangeCallback();

        interpreterMock.verify(m => m.interpret(It.isAny()), Times.never());
        quickAssessStoreMock.verify(m => m.getState(), Times.never());
    });

    test('initialize: send message to transfer data to assessment and another to finalize the transfer', async () => {
        const assessmentDataStub = {
            resultDescription: 'some assessment result description',
        } as AssessmentStoreData;
        const expectedTransferMessage = {
            messageType: Messages.DataTransfer.TransferDataToAssessment,
            payload: {
                assessmentData: assessmentDataStub,
            },
        } as InterpreterMessage;
        const expectedFinalizeMessage = {
            messageType: Messages.DataTransfer.FinalizeTransferDataToAssessment,
        } as InterpreterMessage;

        setupDataTransferStoreMock({ quickAssessToAssessmentInitiated: true });
        quickAssessStoreMock.setup(m => m.getState()).returns(() => assessmentDataStub);
        interpreterMock
            .setup(m => m.interpret(It.isValue(expectedTransferMessage)))
            .returns(() => ({ messageHandled: true, result: undefined }));
        interpreterMock
            .setup(m => m.interpret(It.isValue(expectedFinalizeMessage)))
            .returns(() => ({ messageHandled: true, result: undefined }));

        await onDataTransferStoreChangeCallback();

        interpreterMock.verifyAll();
    });

    function setupDataTransferStoreMock(state: DataTransferStoreData) {
        dataTransferStoreMock.setup(m => m.getState()).returns(() => state);
    }
});
