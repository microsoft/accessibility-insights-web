// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, MockBehavior } from 'typemoq';

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

    it('should call saveAssessment on click', async () => {
        const eventStub = new EventStubFactory().createMouseClickEvent() as any;
        const rendered = shallow(<SaveAssessmentButton {...propsStub} />);
        const button = rendered.find(InsightsCommandButton);

        detailsViewActionMessageCreatorMock.setup(m => m.saveAssessment(It.isAny())).verifiable();

        await button.simulate('click', eventStub);

        detailsViewActionMessageCreatorMock.verifyAll();
    });
});
