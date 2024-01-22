// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ChoiceGroup, IconButton } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import {
    onAddFailureInstanceClicked,
    onGroupChoiceChange,
    onUndoClicked,
    TabStopsChoiceGroup,
    TabStopsChoiceGroupsProps,
} from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
describe('TabStopsChoiceGroup', () => {
    mockReactComponents([ChoiceGroup, IconButton]);
    let props: TabStopsChoiceGroupsProps;
    let onGroupChoiceChangeMock: IMock<onGroupChoiceChange>;
    let onUndoClickedMock: IMock<onUndoClicked>;
    let onAddFailureInstanceMock: IMock<onAddFailureInstanceClicked>;

    beforeEach(() => {
        onGroupChoiceChangeMock = Mock.ofType<onGroupChoiceChange>();
        onUndoClickedMock = Mock.ofType<onUndoClicked>();
        onAddFailureInstanceMock = Mock.ofInstance<onAddFailureInstanceClicked>(_ => null); // rendered in snapshot; must be mock type of instance

        props = {
            onGroupChoiceChange: onGroupChoiceChangeMock.object,
            onUndoClicked: onUndoClickedMock.object,
            onAddFailureInstanceClicked: onAddFailureInstanceMock.object,
            status: TabStopRequirementStatuses.unknown,
        };
    });

    test('render with unknown status', () => {
        const renderResult = render(<TabStopsChoiceGroup {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChoiceGroup]);
    });

    test('render with unknown status (does not show undo button)', () => {
        const renderResult = render(<TabStopsChoiceGroup {...props} />);
        expect(renderResult.queryByRole('button')).not.toBeTruthy();
    });

    test('render with fail status', () => {
        props.status = TabStopRequirementStatuses.fail;
        const renderResult = render(<TabStopsChoiceGroup {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChoiceGroup, IconButton]);
    });

    test('render with pass status', () => {
        props.status = TabStopRequirementStatuses.pass;
        const renderResult = render(<TabStopsChoiceGroup {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChoiceGroup]);
    });

    test('verify component is correctly used with undo', async () => {
        props.status = TabStopRequirementStatuses.pass;
        useOriginalReactElements('@fluentui/react', ['ChoiceGroup', 'IconButton']);
        const renderResult = render(<TabStopsChoiceGroup {...props} />);

        const undoButton = renderResult.getAllByRole('button');
        const radioButton = renderResult.getAllByRole('radio');

        expect(undoButton).not.toBeNull();
        fireEvent.click(undoButton[0]);
        expect(radioButton[0]).toHaveFocus();
        onUndoClickedMock.verify(m => m(It.isAny()), Times.once());
    });

    test('verify on change appropriately calls onGroupChoiceChange', async () => {
        useOriginalReactElements('@fluentui/react', ['ChoiceGroup', 'IconButton']);
        const renderResult = render(<TabStopsChoiceGroup {...props} />);
        const choiceGroupChange = renderResult.getAllByRole('radio');

        fireEvent.click(choiceGroupChange[0]);

        onGroupChoiceChangeMock.verify(m => m(It.isAny(), It.isAny()), Times.once());
    });
});
