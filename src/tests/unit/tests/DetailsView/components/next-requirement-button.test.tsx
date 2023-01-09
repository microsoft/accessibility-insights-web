// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultButton } from '@fluentui/react';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    NextRequirementButton,
    NextRequirementButtonDeps,
    NextRequirementButtonProps,
} from 'DetailsView/components/next-requirement-button';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
describe('NextRequirementButton', () => {
    let messageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let eventStub: React.MouseEvent<HTMLElement>;
    let props: NextRequirementButtonProps;

    beforeEach(() => {
        messageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        eventStub = {} as React.MouseEvent<HTMLElement>;
        props = {
            deps: {
                getAssessmentActionMessageCreator: () => messageCreatorMock.object,
            } as NextRequirementButtonDeps,
            nextRequirement: {
                key: 'some requirement key',
            } as Requirement,
            nextRequirementVisualizationType: -1,
        };
    });

    it('renders', () => {
        const rendered = shallow(<NextRequirementButton {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('validate next requirement button', () => {
        messageCreatorMock
            .setup(mock =>
                mock.selectNextRequirement(
                    eventStub,
                    props.nextRequirement.key,
                    props.nextRequirementVisualizationType,
                ),
            )
            .verifiable();

        const rendered = shallow(<NextRequirementButton {...props} />);
        rendered.find(DefaultButton).prop('onClick')(eventStub);
        messageCreatorMock.verifyAll();
    });
});
