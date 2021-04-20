// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import { Mock, Times } from 'typemoq';

describe('LoadAssessmentHelper', () => {
    const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    const assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
    const fileReaderMock = Mock.ofType(FileReader);
    const documentMock = Mock.ofType(Document);
    const clickMock = Mock.ofType<() => void>();
    const tabIdStub = -1;
    let assessmentData: VersionedAssessmentData;
    let content: string;
    let file: File;
    let inputStub;
    let event;
    let readerEvent;

    it('it accepts an assessment for load', () => {
        assessmentDataParserMock
            .setup(a => a.parseAssessmentData(content))
            .returns(() => assessmentData)
            .verifiable(Times.once());

        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData, tabIdStub))
            .verifiable(Times.once());

        fileReaderMock.setup(f => f.readAsText(file, 'UTF-8')).verifiable(Times.once());

        fileReaderMock.callBase = true;

        documentMock
            .setup(d => d.createElement('input'))
            .returns(() => inputStub)
            .verifiable(Times.once());

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

        const testLoadAssessmentHelper = new LoadAssessmentHelper(
            assessmentDataParserMock.object,
            detailsViewActionMessageCreatorMock.object,
            fileReaderMock.object,
            documentMock.object,
            tabIdStub,
        );

        testLoadAssessmentHelper.getAssessmentForLoad();
        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);

        expect(inputStub.type).toBe('file');
        expect(inputStub.accept).toBe('.a11ywebassessment');
        assessmentDataParserMock.verifyAll();
        detailsViewActionMessageCreatorMock.verifyAll();
        fileReaderMock.verifyAll();
        documentMock.verifyAll();
        clickMock.verifyAll();
    });
});
