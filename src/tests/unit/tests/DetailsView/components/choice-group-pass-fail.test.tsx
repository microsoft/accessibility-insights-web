// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton } from '@fluentui/react';
import {
    ChoiceGroupPassFail,
    ChoiceGroupPassFailProps,
} from 'DetailsView/components/choice-group-pass-fail';
import { mount, shallow } from 'enzyme';
import * as React from 'react';

describe('ChoiceGroupPassFail', () => {
    let props: ChoiceGroupPassFailProps;

    beforeEach(() => {
        props = {
            options: [
                { key: 'pass', text: 'Pass' },
                { key: 'pass', text: 'Fail' },
            ],
            selectedKey: 'unknown',
            onChange: () => {},
            secondaryControls: (
                <IconButton iconProps={{ iconName: 'undo' }} aria-label="undo" noClick={() => {}} />
            ),
            componentRef: () => {},
        };
    });

    test('selectedKey: pass', () => {
        props.selectedKey = 'pass';
        const component = mount(<ChoiceGroupPassFail {...props} />);
        expect(component.props()).toMatchObject({ selectedKey: 'pass' });
    });

    test('selectedKey: fail', () => {
        props.selectedKey = 'fail';
        const component = mount(<ChoiceGroupPassFail {...props} />);
        expect(component.props()).toMatchObject({ selectedKey: 'fail' });
    });

    test('render', () => {
        props.selectedKey = 'pass';
        const wrapper = shallow(<ChoiceGroupPassFail {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render: selectedKey is set to UNKNOWN', () => {
        props.selectedKey = 'unknown';
        const actual = shallow(<ChoiceGroupPassFail {...props} />);
        expect(actual.getElement()).toMatchSnapshot();
    });

    test('render label, aria-label is not defined', () => {
        props.selectedKey = 'pass';
        props.isLabelVisible = true;

        const testSubject = mount(<ChoiceGroupPassFail {...props} />);
        const optionFail = testSubject.find('input.option-fail');
        const optionPass = testSubject.find('input.option-pass');
        expect(optionFail.props()['aria-label']).toBeUndefined();
        expect(optionPass.props()['aria-label']).toBeUndefined();

        const optionLabelFail = testSubject.find('input.option-fail ~ label');
        const optionLabelPass = testSubject.find('input.option-pass ~ label');
        expect(optionLabelFail.text()).toEqual('Fail');
        expect(optionLabelPass.text()).toEqual('Pass');
    });

    test('render options without label, aria-label is defined', () => {
        props.selectedKey = 'pass';
        props.isLabelVisible = false;

        const testSubject = mount(<ChoiceGroupPassFail {...props} />);
        const optionFail = testSubject.find('input.option-fail');
        const optionPass = testSubject.find('input.option-pass');
        expect(optionFail.props()['aria-label']).toEqual('Fail');
        expect(optionPass.props()['aria-label']).toEqual('Pass');

        const optionLabelFail = testSubject.find('input.option-fail ~ label');
        const optionLabelPass = testSubject.find('input.option-pass ~ label');
        expect(optionLabelFail.text()).toEqual('');
        expect(optionLabelPass.text()).toEqual('');
    });
});
