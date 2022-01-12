// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ChoiceGroup, IChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { Mock, Times } from 'typemoq';

import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    TestStatusChoiceGroup,
    TestStatusChoiceGroupProps,
} from '../../../../../DetailsView/components/test-status-choice-group';
import { undoButton } from '../../../../../DetailsView/components/test-status-choice-group.scss';

describe('TestStatusChoiceGroup', () => {
    const options = [
        { key: ManualTestStatus[ManualTestStatus.PASS], text: 'Pass' },
        { key: ManualTestStatus[ManualTestStatus.FAIL], text: 'Fail' },
    ];

    test('constructor', () => {
        const props: TestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.PASS,
            originalStatus: null,
            onGroupChoiceChange: null,
            onUndoClicked: null,
        };
        const component = new TestStatusChoiceGroup(props);
        expect(component.state).toMatchObject({ selectedKey: 'PASS' });
    });

    test('componentDidUpdate: props have not changed', () => {
        const props: TestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.PASS,
            originalStatus: null,
            onGroupChoiceChange: null,
            onUndoClicked: null,
        };
        const component = shallow(
            <TestStatusChoiceGroup {...props} />,
        ).instance() as TestStatusChoiceGroup;
        component.componentDidUpdate(props);
        expect(component.state).toMatchObject({ selectedKey: 'PASS' });
    });

    test('componentDidUpdate: props have changed', () => {
        const props: TestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.FAIL,
            originalStatus: null,
            onGroupChoiceChange: null,
            onUndoClicked: null,
        };
        const component = shallow(
            <TestStatusChoiceGroup {...props} />,
        ).instance() as TestStatusChoiceGroup;
        component.setState({ selectedKey: 'PASS' });
        component.componentDidUpdate({
            status: ManualTestStatus.PASS,
        } as TestStatusChoiceGroupProps);
        expect(component.state).toMatchObject({ selectedKey: 'FAIL' });
    });

    test('render', () => {
        const onGroupChoiceChangeMock = Mock.ofInstance((status, test, step, selector) => {});
        const onUndoMock = Mock.ofInstance((test, step, selector) => {});
        const props: TestStatusChoiceGroupProps = {
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

        const wrapper = shallow(<TestStatusChoiceGroup {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render: selectedKey is set to UNKNOWN as status is UNKNOWN', () => {
        const props: TestStatusChoiceGroupProps = {
            status: ManualTestStatus.UNKNOWN,
        } as TestStatusChoiceGroupProps;

        const actual = shallow(<TestStatusChoiceGroup {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });

    test('render: selectedKey is not set to undefined as status is PASS', () => {
        const props: TestStatusChoiceGroupProps = {
            status: ManualTestStatus.PASS,
        } as TestStatusChoiceGroupProps;

        const actual = shallow(<TestStatusChoiceGroup {...props} />);

        expect(actual.getElement()).toMatchSnapshot();
    });

    test('verify onChange', () => {
        const onGroupChoiceChangeMock = Mock.ofInstance((status, test, step, selector) => {});
        const onUndoMock = Mock.ofInstance((test, step, selector) => {});
        const props: TestStatusChoiceGroupProps = {
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
        const props: TestStatusChoiceGroupProps = {
            test: 1,
            step: 'step',
            selector: 'selector',
            status: ManualTestStatus.PASS,
            originalStatus: ManualTestStatus.FAIL,
            onGroupChoiceChange: onGroupChoiceChangeMock.object,
            onUndoClicked: onUndoMock.object,
        };

        onUndoMock.setup(o => o(props.test, props.step, props.selector)).verifiable(Times.once());

        const component = React.createElement(TestableTestStatusChoiceGroup, props);
        const testObject = TestUtils.renderIntoDocument(component);
        const link = TestUtils.findRenderedDOMComponentWithClass(testObject, undoButton);

        expect(link).toBeDefined();

        focusMock.setup(f => f()).verifiable(Times.once());

        testObject.getComponent().focus = focusMock.object;

        testObject.getOnUndo()();

        focusMock.verifyAll();
        onUndoMock.verifyAll();
    });
});

class TestableTestStatusChoiceGroup extends TestStatusChoiceGroup {
    public getOnChange(): (ev: React.FocusEvent<HTMLElement>, option: IChoiceGroupOption) => void {
        return this.onChange;
    }

    public getOnUndo(): () => void {
        return this.onUndoClicked;
    }

    public getComponentRef(): (component: IChoiceGroup) => void {
        return this.compomentRef;
    }

    public getComponent(): IChoiceGroup {
        return this.choiceGroup;
    }
}
