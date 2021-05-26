// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';

import { IMock, It, Mock, Times } from 'typemoq';

describe('LoadAssessmentHelper', () => {
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let assessmentDataParserMock: IMock<AssessmentDataParser>;
    let fileReaderMock: IMock<FileReader>;
    let documentMock: IMock<Document>;
    let setAssessmentStateMock: IMock<(versionedAssessmentData: VersionedAssessmentData) => void>;
    let toggleLoadDialogMock: IMock<() => void>;
    let toggleInvalidLoadDialogMock: IMock<() => void>;
    let clickMock: IMock<() => void>;
    let loadAssessmentDataValidatorMock: IMock<LoadAssessmentDataValidator>;

    const prevTargetPageDataStub = {
        id: 1,
        url: 'http://test.com',
        title: 'test',
    } as PersistedTabInfo;
    const tabId = 1;
    let assessmentData: VersionedAssessmentData;
    let content: string;
    let file: File;
    let inputStub;
    let event;
    let readerEvent;
    let testSubject: LoadAssessmentHelper;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
        loadAssessmentDataValidatorMock = Mock.ofType(LoadAssessmentDataValidator);
        fileReaderMock = Mock.ofType(FileReader);
        documentMock = Mock.ofType(Document);
        clickMock = Mock.ofType<() => void>();
        setAssessmentStateMock = Mock.ofType<() => void>();
        toggleLoadDialogMock = Mock.ofType<() => void>();
        toggleInvalidLoadDialogMock = Mock.ofType<() => void>();

        loadAssessmentDataValidatorMock
            .setup(adp => adp.uploadedDataIsValid(It.isAny()))
            .returns(() => {
                return { dataIsValid: true, errors: null };
            })
            .verifiable(Times.once());

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

        testSubject = new LoadAssessmentHelper(
            assessmentDataParserMock.object,
            detailsViewActionMessageCreatorMock.object,
            fileReaderMock.object,
            documentMock.object,
            loadAssessmentDataValidatorMock.object,
        );
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
            .setup(d => d.loadAssessment(assessmentData, tabId))
            .verifiable(Times.once());

        toggleLoadDialogMock.setup(ldm => ldm()).verifiable(Times.never());
        toggleInvalidLoadDialogMock.setup(ldm => ldm()).verifiable(Times.never());

        testSubject.getAssessmentForLoad(
            setAssessmentStateMock.object,
            toggleInvalidLoadDialogMock.object,
            toggleLoadDialogMock.object,
            null,
            tabId,
        );

        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);

        expect(inputStub.type).toBe('file');
        expect(inputStub.accept).toBe('.a11ywebassessment');
    });

    it('toggles dialog when prevTargetPageData is not null', () => {
        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData, tabId))
            .verifiable(Times.never());

        toggleLoadDialogMock.setup(ldm => ldm()).verifiable(Times.once());
        toggleInvalidLoadDialogMock.setup(ldm => ldm()).verifiable(Times.never());

        testSubject.getAssessmentForLoad(
            setAssessmentStateMock.object,
            toggleInvalidLoadDialogMock.object,
            toggleLoadDialogMock.object,
            prevTargetPageDataStub,
            tabId,
        );

        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);
    });

    it('toggles invalid dialog when validationData is not valid', () => {
        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData, tabId))
            .verifiable(Times.never());

        toggleLoadDialogMock.setup(ldm => ldm()).verifiable(Times.never());
        toggleInvalidLoadDialogMock.setup(ldm => ldm()).verifiable(Times.once());

        loadAssessmentDataValidatorMock
            .setup(adp => adp.uploadedDataIsValid(It.isAny()))
            .returns(() => {
                return { dataIsValid: false, errors: null };
            })
            .verifiable(Times.once());

        testSubject.getAssessmentForLoad(
            setAssessmentStateMock.object,
            toggleInvalidLoadDialogMock.object,
            toggleLoadDialogMock.object,
            prevTargetPageDataStub,
            tabId,
        );

        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);
    });

    it('toggles invalid dialog when parsed data is not valid JSON', () => {
        detailsViewActionMessageCreatorMock
            .setup(d => d.loadAssessment(assessmentData, tabId))
            .verifiable(Times.never());

        toggleLoadDialogMock.setup(ldm => ldm()).verifiable(Times.never());
        toggleInvalidLoadDialogMock.setup(ldm => ldm()).verifiable(Times.once());

        let errorToThrow: Error;
        assessmentDataParserMock
            .setup(a => a.parseAssessmentData(content))
            .throws(errorToThrow)
            .verifiable(Times.once());

        testSubject.getAssessmentForLoad(
            setAssessmentStateMock.object,
            toggleInvalidLoadDialogMock.object,
            toggleLoadDialogMock.object,
            prevTargetPageDataStub,
            tabId,
        );

        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);
    });
});
