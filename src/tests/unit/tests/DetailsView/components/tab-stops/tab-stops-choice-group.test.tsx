// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ChoiceGroup, IChoiceGroup, IconButton } from '@fluentui/react';
import { TabStopRequirementStatuses } from 'common/types/store-data/visualization-scan-result-data';
import { ChoiceGroupPassFail } from 'DetailsView/components/choice-group-pass-fail';
import {
    ITabStopsChoiceGroup,
    onAddFailureInstanceClicked,
    onGroupChoiceChange,
    onUndoClicked,
    TabStopsChoiceGroup,
    TabStopsChoiceGroupsProps,
} from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('TabStopsChoiceGroup', () => {
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
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('render with unknown status (does not show undo button)', () => {
        const testSubject = mount(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.find(IconButton).exists()).toBeFalsy();
    });

    test('render with fail status', () => {
        props.status = TabStopRequirementStatuses.fail;
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('render with pass status', () => {
        props.status = TabStopRequirementStatuses.pass;
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('verify component is correctly used with undo', () => {
        props.status = TabStopRequirementStatuses.pass;
        const testSubject = mount(<TabStopsChoiceGroup {...props} />);
        const choiceGroupMock = Mock.ofType<IChoiceGroup>();
        const eventStub = {} as React.MouseEvent<HTMLElement>;

        const setComponentRef = testSubject.find(ChoiceGroup).prop('componentRef') as any;
        const undoLinkOnClicked = testSubject.find(IconButton).prop('onClick');

        setComponentRef(choiceGroupMock.object);
        undoLinkOnClicked(eventStub);

        choiceGroupMock.verify(m => m.focus(), Times.once());
        onUndoClickedMock.verify(m => m(eventStub), Times.once());
    });

    test('verify on change appropriately calls onGroupChoiceChange', () => {
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        const onChange = testSubject.find(ChoiceGroupPassFail).prop('onChange');
        const eventStub = {} as React.MouseEvent<HTMLElement>;
        const optionStub = { key: 'pass' } as ITabStopsChoiceGroup;

        onChange(eventStub, optionStub);

        onGroupChoiceChangeMock.verify(
            m => m(eventStub, TabStopRequirementStatuses.pass),
            Times.once(),
        );
    });
});
