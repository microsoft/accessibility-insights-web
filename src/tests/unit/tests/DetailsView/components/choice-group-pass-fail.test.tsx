// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroup, IconButton } from '@fluentui/react';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import {
    ChoiceGroupPassFail,
    ChoiceGroupPassFailProps,
} from 'DetailsView/components/choice-group-pass-fail';
import { onUndoClicked } from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
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
            onChange: () => {},
            secondaryControls: (
                <IconButton iconProps={{ iconName: 'add' }} aria-label="add" noClick={() => {}} />
            ),
            onUndoClickedPassThrough: onUndoClickedMock.object,
        };
    });

    test('render', () => {
        const wrapper = shallow(<ChoiceGroupPassFail {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render: selectedKey is set to FAIL', () => {
        props.selectedKey = TabStopRequirementStatuses.fail;
        const actual = shallow(<ChoiceGroupPassFail {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    test('render: selectedKey is set to PASS', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        const actual = shallow(<ChoiceGroupPassFail {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    test('render label, aria-label is not defined', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = true;

        const testSubject = mount(<ChoiceGroupPassFail {...props} />);
        const options = testSubject.find('input');
        expect(options.at(0).props()['aria-label']).toBeUndefined();
        expect(options.at(1).props()['aria-label']).toBeUndefined();

        const labels = testSubject.find('label');
        expect(labels.at(0).text()).toEqual('Pass');
        expect(labels.at(1).text()).toEqual('Fail');
    });

    test('render options without label, aria-label is defined', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.isLabelVisible = false;

        const testSubject = mount(<ChoiceGroupPassFail {...props} />);
        const options = testSubject.find('input');
        expect(options.at(0).props()['aria-label']).toEqual('Pass');
        expect(options.at(1).props()['aria-label']).toEqual('Fail');

        const labels = testSubject.find('label');
        expect(labels.at(0).text()).toEqual('');
        expect(labels.at(1).text()).toEqual('');
    });

    test('verify undo button is present with selection', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;
        const testSubject = mount(<ChoiceGroupPassFail {...props} />);
        expect(testSubject.find(IconButton).exists()).toBeTruthy();
    });

    test('verify component is correctly used with undo', () => {
        props.selectedKey = TabStopRequirementStatuses.pass;
        props.secondaryControls = null;

        const testSubject = shallow(<ChoiceGroupPassFail {...props} />);
        const choiceGroupMock = Mock.ofType<IChoiceGroup>();
        const eventStub = {} as React.MouseEvent<HTMLElement>;

        const setComponentRef = testSubject.find(ChoiceGroup).prop('componentRef') as any;
        const undoLinkOnClicked = testSubject.find(IconButton).prop('onClick');

        setComponentRef(choiceGroupMock.object);
        undoLinkOnClicked(eventStub);

        choiceGroupMock.verify(m => m.focus(), Times.once());
        onUndoClickedMock.verify(m => m(eventStub), Times.once());
    });
});
