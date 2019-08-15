// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';
import { DefaultButton, TextField } from '../../../../../../node_modules/office-ui-fabric-react';
import { FailureInstancePanelDetails } from '../../../../../DetailsView/components/failure-instance-panel-details';

describe('FailureInstancePanelDetailsTest', () => {
    const path = 'Given Path';
    const onSelectorChangeMock = Mock.ofInstance((value: string) => {});
    const onValidateSelectorMock = Mock.ofInstance(() => {});

    beforeEach(() => {
        onSelectorChangeMock.reset();
        onValidateSelectorMock.reset();
    });

    const rendered = shallow(createFailureInstancePanelDetails(null, false));

    test('renders with no snippet', () => {
        const noSnippetRender = shallow(createFailureInstancePanelDetails(null, false));
        expect(noSnippetRender.exists());
        expect(noSnippetRender.getElement()).toMatchSnapshot();
    });

    test('renders with invalid snippet', () => {
        const invalidSnippetRender = shallow(createFailureInstancePanelDetails(null, true));
        expect(invalidSnippetRender.exists());
        expect(invalidSnippetRender.getElement()).toMatchSnapshot();
    });

    test('renders with valid snippet', () => {
        const validSnippetRender = shallow(createFailureInstancePanelDetails('Found snippet', false));
        expect(validSnippetRender.exists());
        expect(validSnippetRender.getElement()).toMatchSnapshot();
    });

    test('triggers selector change on typing', () => {
        const newPath = 'updated path';
        onSelectorChangeMock.setup(dc => dc(It.isValue(newPath))).verifiable(Times.once());
        const textField = rendered.find(TextField);
        textField.simulate('change', newPath);
        onSelectorChangeMock.verifyAll();
    });

    test('triggers validation on click', () => {
        onValidateSelectorMock.setup(getter => getter()).verifiable(Times.once());
        rendered.find(DefaultButton).simulate('click');
        onValidateSelectorMock.verifyAll();
    });

    function createFailureInstancePanelDetails(snippet: string, error: boolean): JSX.Element {
        return (
            <FailureInstancePanelDetails
                path={path}
                snippetCondition={{ associatedPath: path, showError: error, snippet: snippet }}
                onSelectorChange={onSelectorChangeMock.object}
                onValidateSelector={onValidateSelectorMock.object}
            ></FailureInstancePanelDetails>
        );
    }
});
