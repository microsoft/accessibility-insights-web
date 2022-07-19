// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IChoiceGroup, IconButton } from '@fluentui/react';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { ChoiceGroupPassFail } from 'DetailsView/components/choice-group-pass-fail';
import { TestStatusChoiceGroup } from 'DetailsView/components/test-status-choice-group';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('TestStatusChoiceGroup', () => {
    let props;
    let onUndoMock;
    let onGroupChoiceChangeMock;

    beforeEach(() => {
        onGroupChoiceChangeMock = Mock.ofInstance((status, test, step, selector) => {});
        onUndoMock = Mock.ofInstance((test, step, selector) => {});

        props = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.UNKNOWN,
            originalStatus: null,
            onGroupChoiceChange: onGroupChoiceChangeMock.object,
            onUndoClicked: onUndoMock.object,
            options: [
                { key: ManualTestStatus.PASS, text: 'Pass' },
                { key: ManualTestStatus.FAIL, text: 'Fail' },
            ],
        };
    });

    test('render: unknown (do not show undo button)', () => {
        const component = mount(<TestStatusChoiceGroup {...props} />);
        const choiceGroup = component.find(ChoiceGroupPassFail);
        expect(choiceGroup.props()).toMatchObject({
            selectedKey: ManualTestStatus.UNKNOWN,
        });
        expect(component.find(IconButton).exists()).toBeFalsy();
    });

    test('render: status is set to UNKNOWN', () => {
        const actual = shallow(<TestStatusChoiceGroup {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    test('render: status is set to PASS', () => {
        props.status = ManualTestStatus.PASS;

        onGroupChoiceChangeMock
            .setup(o => o(props.status, props.test, props.step, props.selector))
            .verifiable(Times.once());

        const wrapper = shallow(<TestStatusChoiceGroup {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render: status is set to FAIL', () => {
        props.status = ManualTestStatus.FAIL;
        const actual = shallow(<TestStatusChoiceGroup {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    test('verify onChange', () => {
        props.status = ManualTestStatus.FAIL;
        onGroupChoiceChangeMock
            .setup(o => o(ManualTestStatus.PASS, props.test, props.step, props.selector))
            .verifiable(Times.once());

        const testObject = shallow(<TestStatusChoiceGroup {...props} />);
        testObject.find(ChoiceGroupPassFail).simulate('change', null, props.options[0]);

        onGroupChoiceChangeMock.verifyAll();
    });

    test('verify undo button', () => {
        const choiceGroupMock = Mock.ofType<IChoiceGroup>();
        const eventStub = {} as React.MouseEvent<HTMLElement>;
        props.status = ManualTestStatus.PASS;
        props.originalStatus = ManualTestStatus.FAIL;

        onUndoMock.setup(o => o(props.test, props.step, props.selector)).verifiable(Times.once());

        const testObject = mount(<TestStatusChoiceGroup {...props} />);
        const setComponentRef = testObject.find(ChoiceGroup).prop('componentRef') as any;
        const undoLinkOnClicked = testObject.find(IconButton).prop('onClick');

        setComponentRef(choiceGroupMock.object);
        undoLinkOnClicked(eventStub);

        choiceGroupMock.verify(m => m.focus(), Times.once());
        onUndoMock.verify(m => m(1, 'step', 'selector'), Times.once());
    });
});
