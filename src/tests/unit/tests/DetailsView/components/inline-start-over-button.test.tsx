// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createEvent, fireEvent, render } from '@testing-library/react';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    InlineStartOverButton,
    InlineStartOverButtonProps,
} from 'DetailsView/components/inline-start-over-button';
import * as React from 'react';
import { It, IMock, Mock } from 'typemoq';
import { InsightsCommandButton } from '../../../../../common/components/controls/insights-command-button';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../common/components/controls/insights-command-button');

describe(InlineStartOverButton.displayName, () => {
    mockReactComponents([InsightsCommandButton]);
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
        const renderResult = render(<InlineStartOverButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([InsightsCommandButton]);
    });

    it('rescans on click', async () => {
        useOriginalReactElements('../../../common/components/controls/insights-command-button', [
            'InsightsCommandButton',
        ]);
        detailsViewActionMessageCreatorMock
            .setup(acm => acm.rescanVisualization(testType, It.isAny()))
            .verifiable();

        const renderResult = render(<InlineStartOverButton {...props} />);
        const button = renderResult.getByRole('button');
        const event = createEvent.click(button);
        fireEvent(button, event);

        detailsViewActionMessageCreatorMock.verifyAll();
    });
});
