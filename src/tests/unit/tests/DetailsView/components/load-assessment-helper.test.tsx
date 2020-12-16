// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { Mock, Times } from 'typemoq';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';

describe('LoadAssessmentHelper', () => {
    let detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    let assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
    let fileReaderMock = Mock.ofType(FileReader);
    let createElementStub: (input: string) => HTMLInputElement;
    let clickMock = Mock.ofType<() => void>();
    let assessmentData: VersionedAssessmentData;
    let content: string;
    let file: File;
    let inputStub;
    let event;
    let readerEvent;
    let expectedElementType: string;

    it('it accepts an assessment for load', () => {
        assessmentDataParserMock
            .setup(a => a.parseAssessmentData(content))
            .returns(() => assessmentData)
            .verifiable(Times.once());

        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData))
            .verifiable(Times.once());

        fileReaderMock.setup(f => f.readAsText(file, 'UTF-8')).verifiable(Times.once());

        fileReaderMock.callBase = true;

        clickMock.setup(c => c()).verifiable(Times.once());

        inputStub = {
            click: clickMock.object,
        };

        createElementStub = (elementType: string) => {
            expectedElementType = elementType;
            return inputStub;
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
            createElementStub,
        );

        testLoadAssessmentHelper.getAssessmentForLoad();
        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);

        expect(inputStub.type).toBe('file');
        expect(inputStub.accept).toBe('.a11ywebassessment');
        expect(expectedElementType).toBe('input');
        assessmentDataParserMock.verifyAll();
        detailsViewActionMessageCreatorMock.verifyAll();
        fileReaderMock.verifyAll();
        clickMock.verifyAll();
    });
});
