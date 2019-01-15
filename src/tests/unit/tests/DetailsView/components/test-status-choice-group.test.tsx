// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { mount, shallow } from 'enzyme';
import { ChoiceGroup, IChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { Mock, Times } from 'typemoq';

import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    ITestStatusChoiceGroupProps,
    TestStatusChoiceGroup,
} from '../../../../../DetailsView/components/test-status-choice-group';

describe('TestStatusChoiceGroup', () => {
    const options = [
        { key: ManualTestStatus[ManualTestStatus.PASS], text: 'Pass' },
        { key: ManualTestStatus[ManualTestStatus.FAIL], text: 'Fail' },
    ];

    test('constructor', () => {
        expect(new TestStatusChoiceGroup({} as ITestStatusChoiceGroupProps)).toBeDefined();
    });

    test('render', () => {
        const onGroupChoiceChangeMock = Mock.ofInstance((status, test, step, selector) => {});
        const onUndoMock = Mock.ofInstance((test, step, selector) => {});
        const props: ITestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.PASS,
            originalStatus: null,
            onGroupChoiceChange: onGroupChoiceChangeMock.object,
            onUndoClicked: onUndoMock.object,
        };
        onGroupChoiceChangeMock
            .setup(o => o(props.status, props.test, props.step, props.selector))
            .verifiable(Times.once());

        const wrapper = mount(<TestStatusChoiceGroup {...props} />);
        const labels = wrapper.find('.ms-Label');

        expect(wrapper.find('.radio-button-group').exists()).toBe(true);
        expect(wrapper.find(ChoiceGroup).exists()).toBe(true);
        expect(wrapper.find(ChoiceGroup).props().options[0].text).toBe('Pass');
        expect(wrapper.find(ChoiceGroup).props().options[1].text).toBe('Fail');
        expect(
            labels
                .at(0)
                .getDOMNode()
                .getAttribute('aria-label'),
        ).toBe('Pass');
        expect(
            labels
                .at(1)
                .getDOMNode()
                .getAttribute('aria-label'),
        ).toBe('Fail');
        expect(labels.at(0).getDOMNode().innerHTML).toBe('');
        expect(labels.at(1).getDOMNode().innerHTML).toBe('');
    });

    test('render: selectedKey is set to undefined as status is UNKNOWN', () => {
        const props: ITestStatusChoiceGroupProps = {
            status: ManualTestStatus.UNKNOWN,
        } as ITestStatusChoiceGroupProps;

        const actual = shallow(<TestStatusChoiceGroup {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });

    test('render: selectedKey is not set to undefined as status is PASS', () => {
        const props: ITestStatusChoiceGroupProps = {
            status: ManualTestStatus.PASS,
        } as ITestStatusChoiceGroupProps;

        const actual = shallow(<TestStatusChoiceGroup {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });

    test('verify onChange', () => {
        const onGroupChoiceChangeMock = Mock.ofInstance((status, test, step, selector) => {});
        const onUndoMock = Mock.ofInstance((test, step, selector) => {});
        const props: ITestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.FAIL,
            originalStatus: null,
            onGroupChoiceChange: onGroupChoiceChangeMock.object,
            onUndoClicked: onUndoMock.object,
        };
        onGroupChoiceChangeMock
            .setup(o => o(ManualTestStatus.PASS, props.test, props.step, props.selector))
            .verifiable(Times.once());

        const testObject = shallow(<TestableTestStatusChoiceGroup {...props} />);
        const choiceGroup = testObject.find(ChoiceGroup);
        choiceGroup.prop('onChange')(null, options[0]);

        onGroupChoiceChangeMock.verifyAll();
    });

    test('verify undo button', () => {
        const focusMock = Mock.ofInstance(() => {});
        const onGroupChoiceChangeMock = Mock.ofInstance((status, test, step, selector) => {});
        const onUndoMock = Mock.ofInstance((test, step, selector) => {});
        const props: ITestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.PASS,
            originalStatus: ManualTestStatus.FAIL,
            onGroupChoiceChange: onGroupChoiceChangeMock.object,
            onUndoClicked: onUndoMock.object,
        };

        onUndoMock
            .setup(o => o(props.test, props.step, props.selector))
            .verifiable(Times.once());

        const component = React.createElement(TestableTestStatusChoiceGroup, props);
        const testObject = TestUtils.renderIntoDocument(component);
        const link = TestUtils.findRenderedDOMComponentWithClass(testObject, 'undo-button');

        expect(link).toBeDefined();

        focusMock
            .setup(f => f())
            .verifiable(Times.once());

        testObject.getComponent().focus = focusMock.object;

        testObject.getOnUndo()();

        focusMock.verifyAll();
        onUndoMock.verifyAll();
    });
});

class TestableTestStatusChoiceGroup extends TestStatusChoiceGroup {
    public getOnChange() {
        return this.onChange;
    }

    public getOnUndo() {
        return this.onUndoClicked;
    }

    public getComponentRef() {
        return this.compomentRef;
    }

    public getComponent(): IChoiceGroup {
        return this._choiceGroup;
    }
}
