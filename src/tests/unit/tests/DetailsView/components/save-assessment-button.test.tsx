// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('SaveAssessmentButton', () => {
    let propsStub: SaveAssessmentButtonProps;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
            MockBehavior.Strict,
        );
        propsStub = {
            deps: { detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object },
            download: 'download',
            href: 'url',
        };
    });

    it('should render per the snapshot', () => {
        const rendered = shallow(<SaveAssessmentButton {...propsStub} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
