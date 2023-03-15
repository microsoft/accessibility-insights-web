// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentCardController } from 'background/assessment-card-controller';
import { AssessmentStore } from 'background/stores/assessment-store';
import { AssessmentCardSelectionMessageCreator } from 'common/message-creators/assessment-card-selection-message-creator';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { It, Mock, MockBehavior, Times } from 'typemoq';

describe('AssessmentCardControllerTest', () => {
    it('listens for assessment store changes and sends message', async () => {
        const assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
        const assessmentCardSelectionMessageCreatorMock = Mock.ofType(
            AssessmentCardSelectionMessageCreator,
            MockBehavior.Strict,
        );
        const assessmentStoreData = {} as AssessmentStoreData;
        let assessmentStoreChangedCallback: () => Promise<void>;
        assessmentStoreMock
            .setup(asm => asm.getState())
            .returns(() => assessmentStoreData)
            .verifiable(Times.once());
        assessmentStoreMock
            .setup(asm =>
                asm.addChangedListener(
                    It.is(param => {
                        return typeof param === 'function';
                    }),
                ),
            )
            .callback(callback => {
                assessmentStoreChangedCallback = callback;
            })
            .verifiable(Times.once());

        assessmentCardSelectionMessageCreatorMock
            .setup(acsmc => acsmc.assessmentStoreChanged(It.isObjectWith(assessmentStoreData)))
            .verifiable();

        const testSubject = new AssessmentCardController(
            assessmentStoreMock.object,
            assessmentCardSelectionMessageCreatorMock.object,
        );
        testSubject.initialize();

        await assessmentStoreChangedCallback();
        assessmentStoreMock.verifyAll();
        assessmentCardSelectionMessageCreatorMock.verifyAll();
    });
});
