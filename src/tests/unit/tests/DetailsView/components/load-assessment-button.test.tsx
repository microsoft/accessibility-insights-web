// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
    LoadAssessmentButtonDeps,
} from 'DetailsView/components/load-assessment-button';
import { shallow } from 'enzyme';
import * as React from 'react';

import { Mock } from 'typemoq';

describe('LoadAssessmentButton', () => {
    const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    const assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
    const urlParserMock = Mock.ofType(UrlParser);
    const fileReaderMock = Mock.ofType(FileReader);
    const documentMock = Mock.ofType(Document);

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
});
