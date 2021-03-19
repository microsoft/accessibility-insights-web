// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Requirement } from 'assessments/types/requirement';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    NextRequirementButton,
    NextRequirementButtonDeps,
    NextRequirementButtonProps,
} from 'DetailsView/components/next-requirement-button';
import { shallow } from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
describe('NextRequirementButton', () => {
    let messageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let eventStub: React.MouseEvent<HTMLElement>;
    let props: NextRequirementButtonProps;

    beforeEach(() => {
        messageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        eventStub = {} as React.MouseEvent<HTMLElement>;
        props = {
            deps: {
                detailsViewActionMessageCreator: messageCreatorMock.object,
            } as NextRequirementButtonDeps,
            nextRequirement: {
                key: 'some requirement key',
            } as Requirement,
            currentTest: -1,
        };
    });

    it('renders', () => {
        const rendered = shallow(<NextRequirementButton {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('validate next requirement button', () => {
        messageCreatorMock
            .setup(mock =>
                mock.selectNextRequirement(eventStub, props.nextRequirement.key, props.currentTest),
            )
            .verifiable();

        const rendered = shallow(<NextRequirementButton {...props} />);
        rendered.find(DefaultButton).prop('onClick')(eventStub);
        messageCreatorMock.verifyAll();
    });
});
