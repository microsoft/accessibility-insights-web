// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DefaultButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { Requirement } from 'assessments/types/requirement';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    NextRequirementButton,
    NextRequirementButtonDeps,
    NextRequirementButtonProps,
} from 'DetailsView/components/next-requirement-button';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import {
    mockReactComponents,
    getMockComponentClassPropsForCall,
    expectMockedComponentPropsToMatchSnapshots,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

describe('NextRequirementButton', () => {
    mockReactComponents([DefaultButton]);
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
        const renderResult = render(<NextRequirementButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([DefaultButton]);
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

        render(<NextRequirementButton {...props} />);
        getMockComponentClassPropsForCall(DefaultButton).onClick(eventStub);
        messageCreatorMock.verifyAll();
    });
});
