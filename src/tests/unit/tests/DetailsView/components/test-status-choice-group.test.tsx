// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChoiceGroup, IconButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { ChoiceGroupPassFail } from 'DetailsView/components/choice-group-pass-fail';

import { TestStatusChoiceGroup } from 'DetailsView/components/test-status-choice-group';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock, Times } from 'typemoq';

jest.mock('DetailsView/components/choice-group-pass-fail');
jest.mock('@fluentui/react');
describe('TestStatusChoiceGroup', () => {
    mockReactComponents([ChoiceGroup, IconButton]);
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
        render(<TestStatusChoiceGroup {...props} />);

        const choiceGroupProps = getMockComponentClassPropsForCall(ChoiceGroupPassFail);

        expect(choiceGroupProps).toMatchObject({
            selectedKey: ManualTestStatus.UNKNOWN,
        });
    });

    test('render: status is set to UNKNOWN', () => {
        const actual = render(<TestStatusChoiceGroup {...props} />);
        expect(actual.asFragment()).toMatchSnapshot();
    });

    test('render: status is set to PASS', () => {
        props.status = ManualTestStatus.PASS;

        onGroupChoiceChangeMock
            .setup(o => o(props.status, props.test, props.step, props.selector))
            .verifiable(Times.once());

        const wrapper = render(<TestStatusChoiceGroup {...props} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    test('render: status is set to FAIL', () => {
        props.status = ManualTestStatus.FAIL;
        const actual = render(<TestStatusChoiceGroup {...props} />);
        expect(actual.asFragment()).toMatchSnapshot();
    });

    test('verify onChange', () => {
        props.status = ManualTestStatus.FAIL;
        onGroupChoiceChangeMock
            .setup(o => o(ManualTestStatus.PASS, props.test, props.step, props.selector))
            .verifiable(Times.once());

        render(<TestStatusChoiceGroup {...props} />);

        getMockComponentClassPropsForCall(ChoiceGroupPassFail).onChange(null, props.options[0]);
        onGroupChoiceChangeMock.verifyAll();
    });

    test('verify undo button', () => {
        onUndoMock.setup(o => o(props.test, props.step, props.selector)).verifiable(Times.once());

        render(<TestStatusChoiceGroup {...props} />);
        getMockComponentClassPropsForCall(ChoiceGroupPassFail).onUndoClickedPassThrough();
        onUndoMock.verifyAll();
    });
});
