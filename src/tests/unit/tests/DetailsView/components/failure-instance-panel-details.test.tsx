// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';
import { DefaultButton, TextField } from '../../../../../../node_modules/@fluentui/react';
import { FailureInstancePanelDetails } from '../../../../../DetailsView/components/failure-instance-panel-details';

describe('FailureInstancePanelDetailsTest', () => {
    const path = 'Given Path';
    const snippet = 'Snippet for Given Path';
    const onSelectorChangeMock = Mock.ofInstance((value: string) => {});
    const onValidateSelectorMock = Mock.ofInstance(() => {});

    beforeEach(() => {
        onSelectorChangeMock.reset();
        onValidateSelectorMock.reset();
    });

    const rendered = shallow(
        <FailureInstancePanelDetails
            path={path}
            snippet={snippet}
            onSelectorChange={onSelectorChangeMock.object}
            onValidateSelector={onValidateSelectorMock.object}
        ></FailureInstancePanelDetails>,
    );

    it('renders', () => {
        expect(rendered.exists());
        expect(rendered.getElement()).toMatchSnapshot();
    });

    it('triggers selector change on typing', () => {
        const newPath = 'updated path';
        onSelectorChangeMock.setup(dc => dc(It.isValue(newPath))).verifiable(Times.once());

        const textField = rendered.find(TextField);
        textField.simulate('change', newPath);
        onSelectorChangeMock.verifyAll();
    });

    it('triggers validation on click', () => {
        onValidateSelectorMock.setup(getter => getter()).verifiable(Times.once());

        rendered.find(DefaultButton).simulate('click');
        onValidateSelectorMock.verifyAll();
    });
});
