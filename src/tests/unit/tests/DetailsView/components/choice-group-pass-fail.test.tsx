// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroup, IconButton } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import {
    ChoiceGroupPassFail,
    ChoiceGroupPassFailProps,
} from 'DetailsView/components/choice-group-pass-fail';
import { onUndoClicked } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import * as React from 'react';
import { getMockComponentClassPropsForCall } from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, Mock, Times } from 'typemoq';

describe('ChoiceGroupPassFail', () => {

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
            onChange: () => { },
            secondaryControls: (
                <IconButton iconProps={{ iconName: 'add' }} aria-label="add" noClick={() => { }} />
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

        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        const options = testSubject.getAllByRole('radio');

        expect(options[0]).not.toHaveProperty('aria-label')
        expect(options[1]).not.toHaveProperty('aria-label')
        expect(testSubject.queryByLabelText('Pass')).not.toBeNull()
        expect(testSubject.queryByLabelText('Fail')).not.toBeNull()
    });

    test('render options without label, aria-label is defined', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = false;

        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        const options = testSubject.getAllByRole('radio');

        expect(options[0].getAttribute('aria-label')).toEqual('Pass')
        expect(options[1].getAttribute('aria-label')).toEqual('Fail')
        expect(options[0].textContent).toEqual('')
        expect(options[1].textContent).toEqual('')
    });

    test('verify undo button is present with selection', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;
        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        expect(testSubject.container.querySelectorAll('.iconButton')).toBeTruthy();
    });

    test('verify component is correctly used with undo', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;

        const testSubject = render(<ChoiceGroupPassFail {...props} />);
        const choiceGroupMock = Mock.ofType<IChoiceGroup>();
        const eventStub = {} as React.MouseEvent<HTMLElement>;


        const setComponentRef = getMockComponentClassPropsForCall(ChoiceGroup) as any;

        const getUndoLink = testSubject.container[0].querySelectorAll('.ms-Button--icon')
        setComponentRef.setComponentRef(choiceGroupMock.object);
        fireEvent.click(getUndoLink, eventStub)

        choiceGroupMock.verify(m => m.focus(), Times.once());
        onUndoClickedMock.verify(m => m(eventStub), Times.once());
    });
});
