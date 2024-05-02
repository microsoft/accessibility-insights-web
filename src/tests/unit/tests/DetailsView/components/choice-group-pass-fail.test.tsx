// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IconButton } from '@fluentui/react';
import { act, render } from '@testing-library/react';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import {
    ChoiceGroupPassFail,
    ChoiceGroupPassFailProps,
} from 'DetailsView/components/choice-group-pass-fail';
import { onUndoClicked } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';
import '@testing-library/jest-dom';

jest.mock('@fluentui/react');

describe('ChoiceGroupPassFail', () => {
    mockReactComponents([ChoiceGroup, IconButton]);
    let props: ChoiceGroupPassFailProps;
    let onUndoClickedMock: IMock<onUndoClicked>;

    beforeEach(() => {
        onUndoClickedMock = Mock.ofType<onUndoClicked>();
        props = {
            options: [
                { key: TabStopRequirementStatuses.pass, text: 'Pass' },
                { key: TabStopRequirementStatuses.fail, text: 'Fail' },
                { key: TabStopRequirementStatuses.unknown, text: 'unknown' as any },
            ],
            selectedKey: TabStopRequirementStatuses.unknown,
            onChange: () => { },
            secondaryControls: (
                <IconButton iconProps={{ iconName: 'add' }} aria-label="add" onClick={() => { }} />
            ),
            onUndoClickedPassThrough: onUndoClickedMock.object,
        };
    });

    test('render', () => {
        const renderResult = render(<ChoiceGroupPassFail {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render: selectedKey is set to FAIL', () => {
        props.selectedKey = TabStopRequirementStatuses.fail;
        const renderResult = render(<ChoiceGroupPassFail {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChoiceGroup, IconButton]);
    });

    test('render: selectedKey is set to PASS', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        const renderResult = render(<ChoiceGroupPassFail {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ChoiceGroup, IconButton]);
    });

    test('render label, aria-label is not defined', () => {
        useOriginalReactElements('@fluentui/react', ['ChoiceGroup', 'IconButton']);
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = true;

        const renderResult = render(<ChoiceGroupPassFail {...props} />);
        const options = renderResult.getAllByRole('radio');

        expect(options[0]).not.toHaveAttribute('aria-label');
        expect(options[1]).not.toHaveAttribute('aria-label');
        expect(renderResult.queryByLabelText('Pass')).not.toBeNull();
        expect(renderResult.queryByLabelText('Fail')).not.toBeNull();
    });

    test('render options without label, aria-label is defined', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = false;

        const renderResult = render(<ChoiceGroupPassFail {...props} />);
        const options = renderResult.getAllByRole('radio');

        expect(options[0]).toHaveAttribute('aria-label', 'Pass');
        expect(options[1]).toHaveAttribute('aria-label', 'Fail');
        expect(options[0].textContent).toEqual('');
        expect(options[1].textContent).toEqual('');
    });

    test('verify undo button is present with selection', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;
        const renderResult = render(<ChoiceGroupPassFail {...props} />);
        expect(renderResult.getByRole('button')).not.toBeNull();
    });

    test('verify component is correctly used with undo', () => {
        useOriginalReactElements('@fluentui/react', ['IconButton']);
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;

        const renderResult = render(<ChoiceGroupPassFail {...props} />);

        const eventStub = {} as React.MouseEvent<HTMLElement>;

        const options = renderResult.getAllByRole('radio');
        act(() => {
            getMockComponentClassPropsForCall(IconButton).onClick(eventStub);
        })


        expect(options[0]).toHaveFocus();

        onUndoClickedMock.verify(m => m(It.isAny()), Times.once());
    });
});
