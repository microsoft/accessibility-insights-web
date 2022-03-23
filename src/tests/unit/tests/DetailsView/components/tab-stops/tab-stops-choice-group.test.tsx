// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ChoiceGroup, IChoiceGroup, Link } from '@fluentui/react';
import {
    ITabStopsChoiceGroup,
    onAddFailureInstanceClicked,
    onGroupChoiceChange,
    onUndoClicked,
    TabStopsChoiceGroup,
    TabStopsChoiceGroupsProps,
} from 'DetailsView/components/tab-stops/tab-stops-choice-group';
import { shallow } from 'enzyme';
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
            status: 'unknown',
        };
    });

    test('render with unknown status', () => {
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('render options with no label', () => {
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        const options = testSubject.find(ChoiceGroup).prop('options');
        expect(options[0].onRenderLabel()).toMatchSnapshot();
        expect(options[1].onRenderLabel()).toMatchSnapshot();
    });

    test('render with fail status', () => {
        props.status = 'fail';
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('render with pass status', () => {
        props.status = 'pass';
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('verify component set by componentRef is correctly used with undo', () => {
        props.status = 'pass';
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        const choiceGroupMock = Mock.ofType<IChoiceGroup>();
        const eventStub = {} as React.MouseEvent<HTMLElement>;

        const setComponentRef = testSubject.find(ChoiceGroup).prop('componentRef') as any;
        const undoLinkOnClicked = testSubject.find(Link).prop('onClick');

        setComponentRef(choiceGroupMock.object);
        undoLinkOnClicked(eventStub);

        choiceGroupMock.verify(m => m.focus(), Times.once());
        onUndoClickedMock.verify(m => m(eventStub), Times.once());
    });

    test('verify on change appropriately calls onGroupChoiceChange', () => {
        const testSubject = shallow(<TabStopsChoiceGroup {...props} />);
        const onChange = testSubject.find(ChoiceGroup).prop('onChange');
        const eventStub = {} as React.MouseEvent<HTMLElement>;
        const optionStub = { key: 'pass' } as ITabStopsChoiceGroup;

        onChange(eventStub, optionStub);

        onGroupChoiceChangeMock.verify(m => m(eventStub, 'pass'), Times.once());
    });
});
