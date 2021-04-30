// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
    LoadAssessmentButtonDeps,
} from 'DetailsView/components/load-assessment-button';
import { shallow } from 'enzyme';
import * as React from 'react';

import { Mock, Times } from 'typemoq';

describe('LoadAssessmentButton', () => {
    const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    const assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
    const urlParserMock = Mock.ofType(UrlParser);
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

    const tabStoreData = {
        id: 5,
    } as TabStoreData;

    const assessmentStoreData = {} as AssessmentStoreData;

    const deps = {
        detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
        assessmentDataParser: assessmentDataParserMock.object,
        urlParser: urlParserMock.object,
        document: documentMock.object,
        fileReader: fileReaderMock.object,
    } as LoadAssessmentButtonDeps;
    const props = { deps, tabStoreData, assessmentStoreData } as LoadAssessmentButtonProps;

    it('should render per the snapshot', () => {
        const rendered = shallow(<LoadAssessmentButton {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('it accepts an assessment for load', () => {
        const wrapper = shallow(<LoadAssessmentButton {...props} />);
        const testSubject = wrapper.instance() as LoadAssessmentButton;

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

        testSubject.getAssessmentForLoad();
        inputStub.onchange(event);
        fileReaderMock.object.onload(readerEvent);

        expect(inputStub.type).toBe('file');
        expect(inputStub.accept).toBe('.a11ywebassessment');
        fileReaderMock.verifyAll();
        documentMock.verifyAll();
        clickMock.verifyAll();
    });
});
