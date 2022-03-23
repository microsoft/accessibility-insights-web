// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TextField } from '@fluentui/react';
import { ActionAndCancelButtonsComponent } from 'DetailsView/components/action-and-cancel-buttons-component';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import {
    FailedInstancePanel,
    FailedInstancePanelProps,
} from 'DetailsView/components/tab-stops/failed-instance-panel';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('FailedInstancePanel', () => {
    let props: FailedInstancePanelProps;
    let onConfirmMock: IMock<() => void>;
    let onChangeMock: IMock<(_: React.SyntheticEvent, d: string) => void>;
    let onDismissMock: IMock<() => void>;

    beforeEach(() => {
        onConfirmMock = Mock.ofInstance(() => null);
        onChangeMock = Mock.ofInstance((_, d) => null);
        onDismissMock = Mock.ofInstance(() => null);
        props = {
            isOpen: true,
            instanceDescription: 'some description',
            headerText: 'some header',
            confirmButtonText: 'some confirm text',
            onChange: onChangeMock.object,
            onConfirm: onConfirmMock.object,
            onDismiss: onDismissMock.object,
        };
    });

    test('renders', () => {
        const testSubject = shallow(<FailedInstancePanel {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });

    test('verify button behaviors', () => {
        const testSubject = shallow(<FailedInstancePanel {...props} />);
        const actionCancelButtonProps = testSubject.find(ActionAndCancelButtonsComponent).props();
        const panelProps = testSubject.find(GenericPanel).props();
        const descriptionTextFieldProps = testSubject.find(TextField).props();

        actionCancelButtonProps.primaryButtonOnClick(null);

        onConfirmMock.verify(m => m(), Times.once());
        expect(actionCancelButtonProps.cancelButtonOnClick).toEqual(onDismissMock.object);
        expect(panelProps.onDismiss).toEqual(onDismissMock.object);
        expect(descriptionTextFieldProps.onChange).toEqual(onChangeMock.object);
    });

    test('primary button disabled without description', () => {
        props.instanceDescription = null;
        const testSubject = shallow(<FailedInstancePanel {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
