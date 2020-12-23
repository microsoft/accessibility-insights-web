// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { shallow } from 'enzyme';

import {
    LoadAssessmentButton,
    LoadAssessmentButtonProps,
    LoadAssessmentButtonDeps,
} from 'DetailsView/components/load-assessment-button';
import { Mock } from 'typemoq';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';

describe('LoadAssessmentButton', () => {
    const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    const assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
    const loadAssessmentHelperMock = Mock.ofType(LoadAssessmentHelper);
    const deps = {
        detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
        assessmentDataParser: assessmentDataParserMock.object,
        loadAssessmentHelper: loadAssessmentHelperMock.object,
    } as LoadAssessmentButtonDeps;
    const props = { deps } as LoadAssessmentButtonProps;

    it('should render per the snapshot', () => {
        const rendered = shallow(<LoadAssessmentButton {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
