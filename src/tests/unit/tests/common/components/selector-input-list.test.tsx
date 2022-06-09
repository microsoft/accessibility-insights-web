// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton, FocusZone, IconButton, ITextField, List, TextField } from '@fluentui/react';
import styles from 'common/components/selector-input-list.scss';
import * as Enzyme from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    SelectorInputList,
    SelectorInputListProps,
} from '../../../../../common/components/selector-input-list';

describe('SelectorInputListTest', () => {
    test('render with list items', () => {
        const givenInput = 'include';
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            inputType: givenInput,
            inspectMode: null,
            items: [['test-item'], ['another-test-item']],
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<SelectorInputList {...props} />);
        result.setState({ isTextFieldValueValid: false });
        genericRenderTests(result, props);
    });

    test('render without list items', () => {
        const givenInput = 'include';
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            inputType: givenInput,
            inspectMode: null,
            items: [],
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<SelectorInputList {...props} />);
        genericRenderTests(result, props);
    });

    test('render with instructions paragraph', () => {
        const givenInput = 'include';
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            inputType: givenInput,
            inspectMode: null,
            items: [],
            instructions: getParagraph(),
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<SelectorInputList {...props} />);
        genericRenderTests(result, props);
        expect(result.find('.test-paragraph').getElement).toBeDefined();
    });

    test('add selector with no space after semicolon', () => {
        const addSelectorMock = Mock.ofInstance(
            (
                event: React.MouseEvent<HTMLButtonElement>,
                inputType: string,
                selector: string[],
            ) => {},
        );
        const givenInput = 'include';
        const givenSelector = 'iframe;selector';
        const parsedSelector = ['iframe', 'selector'];
        addSelectorMock
            .setup(add => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector)))
            .verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: addSelectorMock.object,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.mount(<TestableSelectorInputList {...props} />);
        genericAddSelectorTests(result, addSelectorMock, givenSelector);
    });

    test('add selector with multiple separators', () => {
        const addSelectorMock = Mock.ofInstance(
            (
                event: React.MouseEvent<HTMLButtonElement>,
                inputType: string,
                selector: string[],
            ) => {},
        );
        const givenSelector = 'iframe;selector;selectorAgain  ;    lastSelector';
        const parsedSelector = ['iframe', 'selector', 'selectorAgain', 'lastSelector'];
        const givenInput = 'include';
        addSelectorMock
            .setup(add => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector)))
            .verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: addSelectorMock.object,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.mount(<TestableSelectorInputList {...props} />);
        genericAddSelectorTests(result, addSelectorMock, givenSelector);
    });

    test('change inspection mode', () => {
        const changeInspectionMock = Mock.ofInstance(
            (event: React.MouseEvent<HTMLButtonElement>, inspectMode: string) => {},
        );
        const givenMode = 'scopingAddInclude';
        const givenInput = 'include';
        changeInspectionMock
            .setup(add => add(It.isAny(), It.isValue(givenMode)))
            .verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: givenMode,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: changeInspectionMock.object,
        };
        const result = Enzyme.shallow(<SelectorInputList {...props} />);
        genericChangeInspectionModeTests(result, changeInspectionMock);
    });

    test('delete selector with no space after semicolon', () => {
        const deleteSelectorMock = Mock.ofInstance(
            (
                event: React.MouseEvent<HTMLButtonElement>,
                inputType: string,
                selector: string[],
            ) => {},
        );
        const givenInput = 'include';
        const parsedSelector = ['iframe', 'selector'];

        deleteSelectorMock
            .setup(add => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector)))
            .verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [parsedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: deleteSelectorMock.object,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<SelectorInputList {...props} />);
        genericDeleteSelectorTests(result, deleteSelectorMock);
    });

    test('add selector button disabled after entering duplicate selector', () => {
        const givenInput = 'include';
        const givenSelector = 'iframe; selector';
        const parsedSelector = ['iframe', 'selector'];

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [parsedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<TestableSelectorInputList {...props} />);
        genericButtonStateTests(result, givenSelector, true);
    });

    test('add selector button disabled after entering blank selector', () => {
        const givenInput = 'include';
        const givenSelector = '';

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<TestableSelectorInputList {...props} />);
        genericButtonStateTests(result, givenSelector, true);
    });

    test('add selector button enabled after entering valid selector', () => {
        const givenInput = 'include';
        const givenSelector = 'second-selector';
        const parsedSelector = ['iframe', 'selector'];

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [parsedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<TestableSelectorInputList {...props} />);
        genericButtonStateTests(result, givenSelector, true);
    });

    test('componentDidUpdate updates state when props have changed', () => {
        const updatedSelector = ['iframe; selector'];
        const givenInput = 'include';
        const givenSelector = 'selector';
        const previousProps: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [updatedSelector],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<TestableSelectorInputList {...props} />);
        const firstState = (result.instance() as TestableSelectorInputList).state
            .isTextFieldValueValid;
        (result.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        (result.instance() as TestableSelectorInputList).componentDidUpdate(previousProps);
        const secondState = (result.instance() as TestableSelectorInputList).state
            .isTextFieldValueValid;
        expect(secondState).toEqual(!firstState);
    });

    test("componentDidUpdate doesn't update state when the props haven't changed ", () => {
        const givenInput = 'include';
        const previousProps: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: null,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };
        const result = Enzyme.shallow(<TestableSelectorInputList {...props} />);
        const firstState = (result.instance() as TestableSelectorInputList).state
            .isTextFieldValueValid;
        (result.instance() as TestableSelectorInputList).componentDidUpdate(previousProps);
        const secondState = (result.instance() as TestableSelectorInputList).state
            .isTextFieldValueValid;
        expect(secondState).toEqual(firstState);
    });

    test('restore sets textfield value to initial value upon entering a valid selector', () => {
        const givenInput = 'include';
        const addSelectorMock = Mock.ofInstance(
            (
                event: React.MouseEvent<HTMLButtonElement>,
                inputType: string,
                selector: string[],
            ) => {},
        );
        const givenSelector = 'selector';
        const parsedSelector = ['selector'];
        addSelectorMock
            .setup(add => add(It.isAny(), It.isValue(givenInput), It.isValue(parsedSelector)))
            .verifiable(Times.once());
        const props: SelectorInputListProps = {
            title: 'test-title',
            subtitle: 'some instructions',
            items: [],
            inputType: givenInput,
            inspectMode: null,
            onAddSelector: addSelectorMock.object,
            onDeleteSelector: null,
            onChangeInspectMode: null,
        };

        const result = Enzyme.shallow(<TestableSelectorInputList {...props} />);
        (result.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        result.setState({ isTextFieldValueValid: true, value: givenSelector });
        const textFieldBeforeAdd = result.find(TextField);
        expect(textFieldBeforeAdd.getElement().props.value).toBe(givenSelector);
        const button = result.find(DefaultButton);
        button.simulate('click');
        const textFieldAfterAdd = result.find(TextField);
        expect(textFieldAfterAdd.getElement().props.value).toBe('');
    });

    function genericButtonStateTests(
        result: Enzyme.ShallowWrapper<any, any>,
        givenSelector: string,
        expectedStateValue: boolean,
    ): void {
        (result.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        result.setState({ isTextFieldValueValid: expectedStateValue });
        const button = result.find(DefaultButton);
        expect(button.getElement().props.disabled).toBe(!expectedStateValue);
    }

    function genericRenderTests(
        result: Enzyme.ShallowWrapper<any, any>,
        props: SelectorInputListProps,
    ): void {
        const textbox = result.find('.' + styles.selectorInputField);
        const selectors = result.find(List);
        const title = result.find('.' + styles.selectorInputTitle);
        expect(title.getElement().props.children).toBe(props.title);
        expect(textbox.getElement().props.ariaLabel).toBe(props.subtitle);
        expect(selectors.getElement().props.items).toBe(props.items);
    }

    function genericAddSelectorTests(
        result: Enzyme.ReactWrapper<any, any>,
        selectorMock: IMock<
            (
                event: React.MouseEvent<HTMLButtonElement>,
                inputType: string,
                selector: string[],
            ) => void
        >,
        givenSelector: string,
    ): void {
        (result.instance() as TestableSelectorInputList).setTextFieldValue(givenSelector);
        result.setState({ isTextFieldValueValid: true });
        const button = result.find(DefaultButton);
        button.simulate('click');
        selectorMock.verifyAll();
    }

    function genericDeleteSelectorTests(
        result: Enzyme.ShallowWrapper<any, any>,
        selectorMock: IMock<
            (
                event: React.MouseEvent<HTMLButtonElement>,
                inputType: string,
                selector: string[],
            ) => void
        >,
    ): void {
        const itemList = result.find(List);
        const createdRow = Enzyme.shallow(
            itemList.getElement().props.onRenderCell(itemList.getElement().props.items[0]),
        );
        const button = createdRow.find(IconButton);
        button.simulate('click');
        selectorMock.verifyAll();
        expect(result.find(FocusZone)).toBeDefined();
    }

    function genericChangeInspectionModeTests(
        result: Enzyme.ShallowWrapper<any, any>,
        selectorMock: IMock<
            (event: React.MouseEvent<HTMLButtonElement>, inspectMode: string) => void
        >,
    ): void {
        const button = result.find(IconButton);
        button.simulate('click');
        selectorMock.verifyAll();
    }

    function getParagraph(): JSX.Element {
        return <p className="test-paragraph">Test</p>;
    }
});

class TestableSelectorInputList extends SelectorInputList {
    public setTextFieldValue(value: string): void {
        this.setTextField({ value, focus: () => {} } as ITextField);
    }
}
