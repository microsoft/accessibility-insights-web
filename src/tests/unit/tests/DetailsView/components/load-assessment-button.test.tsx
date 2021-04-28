// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.
// import { AssessmentDataParser } from 'common/assessment-data-parser';
// import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
// import {
//     LoadAssessmentButton,
//     LoadAssessmentButtonProps,
//     LoadAssessmentButtonDeps,
// } from 'DetailsView/components/load-assessment-button';
// import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
// import { shallow } from 'enzyme';
// import * as React from 'react';

// import { Mock } from 'typemoq';

// describe('LoadAssessmentButton', () => {
//     const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
//     const assessmentDataParserMock = Mock.ofType(AssessmentDataParser);
//     const loadAssessmentHelperMock = Mock.ofType(LoadAssessmentHelper);
//     const deps = {
//         detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
//         assessmentDataParser: assessmentDataParserMock.object,
//         loadAssessmentHelper: loadAssessmentHelperMock.object,
//     } as LoadAssessmentButtonDeps;
//     const props = { deps } as LoadAssessmentButtonProps;

//     it('should render per the snapshot', () => {
//         const rendered = shallow(<LoadAssessmentButton {...props} />);

//         expect(rendered.getElement()).toMatchSnapshot();
//     });
// });
