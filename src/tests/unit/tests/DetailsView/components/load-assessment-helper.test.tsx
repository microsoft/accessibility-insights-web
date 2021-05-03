// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { getAssessmentForLoad } from 'DetailsView/components/load-assessment-helper';

import { IMock, It, Mock, Times } from 'typemoq';

describe('LoadAssessmentButton', () => {
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentDataParserMock: IMock<AssessmentDataParser>;
    let fileReaderMock: IMock<FileReader>;
    let documentMock: IMock<Document>;
    let setAssessmentStateMock: IMock<(versionedAssessmentData: VersionedAssessmentData) => void>;
    let toggleLoadDialogMock: IMock<() => void>;
    let clickMock: IMock<() => void>;
    const prevTargetPageDataStub = {
        id: 1,
        url: 'http://test.com',
        title: 'test',
    } as PersistedTabInfo;
    const tabIdStub = 1;
    let assessmentData: VersionedAssessmentData;
    let content: string;
    let file: File;
    let inputStub;
    let event;
    let readerEvent;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
        fileReaderMock = Mock.ofType(FileReader);
        documentMock = Mock.ofType(Document);
        clickMock = Mock.ofType<() => void>();
        setAssessmentStateMock = Mock.ofType<() => void>();
        toggleLoadDialogMock = Mock.ofType<() => void>();

        assessmentDataParserMock
            .setup(a => a.parseAssessmentData(content))
            .returns(() => assessmentData)
            .verifiable(Times.once());

        fileReaderMock.setup(f => f.readAsText(file, 'UTF-8')).verifiable(Times.once());

        fileReaderMock.callBase = true;

        documentMock
            .setup(d => d.createElement('input'))
            .returns(() => inputStub)
            .verifiable(Times.once());

        setAssessmentStateMock.setup(asm => asm(It.isAny())).verifiable(Times.once());

        clickMock.setup(c => c()).verifiable(Times.once());

        inputStub = {
            click: clickMock.object,
        };

        event = {
            target: {
                files: [file],
            },
        };

        readerEvent = {
            target: {
                result: content,
            },
        };
    });

    afterEach(() => {
        fileReaderMock.verifyAll();
        documentMock.verifyAll();
        clickMock.verifyAll();
        detailsViewActionMessageCreatorMock.verifyAll();
        setAssessmentStateMock.verifyAll();
    });

    it('it loads assessment when prevTargetPageData is null', () => {
        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData, tabIdStub))
            .verifiable(Times.once());

        toggleLoadDialogMock.setup(ldm => ldm()).verifiable(Times.never());

        getAssessmentForLoad(
            assessmentDataParserMock.object,
            detailsViewActionMessageCreatorMock.object,
            documentMock.object,
            setAssessmentStateMock.object,
            toggleLoadDialogMock.object,
            null,
            tabIdStub,
            fileReaderMock.object,
        );

        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);

        expect(inputStub.type).toBe('file');
        expect(inputStub.accept).toBe('.a11ywebassessment');
    });

    it('toggles dialog when prevTargetPageData is not null', () => {
        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData, tabIdStub))
            .verifiable(Times.never());

        toggleLoadDialogMock.setup(ldm => ldm()).verifiable(Times.once());

        getAssessmentForLoad(
            assessmentDataParserMock.object,
            detailsViewActionMessageCreatorMock.object,
            documentMock.object,
            setAssessmentStateMock.object,
            toggleLoadDialogMock.object,
            prevTargetPageDataStub,
            tabIdStub,
            fileReaderMock.object,
        );

        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);
    });
});
