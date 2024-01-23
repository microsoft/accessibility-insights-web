// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IconButton } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import {
    ChoiceGroupPassFail,
    ChoiceGroupPassFailProps,
} from 'DetailsView/components/choice-group-pass-fail';
import { onUndoClicked } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import * as React from 'react';
import {
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
            ],
            selectedKey: TabStopRequirementStatuses.unknown,
            onChange: () => {},
            secondaryControls: (
                <IconButton iconProps={{ iconName: 'add' }} aria-label="add" noClick={() => {}} />
            ),
            onUndoClickedPassThrough: onUndoClickedMock.object,
        };
    });

    test('render', () => {
        const wrapper = render(<ChoiceGroupPassFail {...props} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    test('render: selectedKey is set to FAIL', () => {
        props.selectedKey = TabStopRequirementStatuses.fail;
        const actual = render(<ChoiceGroupPassFail {...props} />);
        expect(actual.asFragment()).toMatchSnapshot();
    });

    test('render: selectedKey is set to PASS', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        const actual = render(<ChoiceGroupPassFail {...props} />);
        expect(actual.asFragment()).toMatchSnapshot();
    });

    test('render label, aria-label is not defined', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = true;
        useOriginalReactElements('@fluentui/react', ['ChoiceGroup', 'IconButton']);
        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        const options = testSubject.getAllByRole('radio');

        expect(options[0]).not.toHaveProperty('aria-label');
        expect(options[1]).not.toHaveProperty('aria-label');
        expect(testSubject.queryByLabelText('Pass')).not.toBeNull();
        expect(testSubject.queryByLabelText('Fail')).not.toBeNull();
    });

    test('render options without label, aria-label is defined', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = false;
        useOriginalReactElements('@fluentui/react', ['ChoiceGroup', 'IconButton']);
        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        const options = testSubject.getAllByRole('radio');

        expect(options[0].getAttribute('aria-label')).toEqual('Pass');
        expect(options[1].getAttribute('aria-label')).toEqual('Fail');
        expect(options[0].textContent).toEqual('');
        expect(options[1].textContent).toEqual('');
    });

    test('verify undo button is present with selection', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;
        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        expect(testSubject.getAllByRole('button')).toBeTruthy();
    });

    test('verify component is correctly used with undo', async () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;

        const testSubject = render(<ChoiceGroupPassFail {...props} />);

        const eventStub = {} as React.MouseEvent<HTMLElement>;
        const undoButton = testSubject.getAllByRole('button');

        const radioButton = testSubject.getAllByRole('radio');

        expect(undoButton).not.toBeNull();

        const getUndoLink = testSubject.container.querySelectorAll('.ms-Button--icon');

        fireEvent.click(getUndoLink[0], eventStub);
        expect(radioButton[0]).toHaveFocus();

        onUndoClickedMock.verify(m => m(It.isAny()), Times.once());
    });
});
