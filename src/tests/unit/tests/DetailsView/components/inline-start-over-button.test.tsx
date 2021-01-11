// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    InlineStartOverButton,
    InlineStartOverButtonProps,
} from 'DetailsView/components/inline-start-over-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe(InlineStartOverButton, () => {
    const testType: VisualizationType = 1;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let props: InlineStartOverButtonProps;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        props = {
            selectedTest: testType,
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
        };
    });

    it('renders', () => {
        const button = shallow(<InlineStartOverButton {...props} />);

        expect(button.getElement()).toMatchSnapshot();
    });

    it('rescans on click', () => {
        const event = {} as MouseEvent;
        detailsViewActionMessageCreatorMock
            .setup(acm => acm.rescanVisualization(testType, event))
            .verifiable();

        const button = shallow(<InlineStartOverButton {...props} />);
        button.simulate('click', event);

        detailsViewActionMessageCreatorMock.verifyAll();
    });
});
