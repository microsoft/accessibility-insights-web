// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TextField } from '@fluentui/react';
import { Button } from '@fluentui/react-components';
import { fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import * as React from 'react';
import { It, Mock, Times } from 'typemoq';
import { FailureInstancePanelDetails } from '../../../../../DetailsView/components/failure-instance-panel-details';
import {
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
jest.mock('@fluentui/react-components');
describe('FailureInstancePanelDetailsTest', () => {
    mockReactComponents([TextField, Button]);
    const path = 'Given Path';
    const snippet = 'Snippet for Given Path';
    const onSelectorChangeMock = Mock.ofInstance((event, value: string) => {});
    const onValidateSelectorMock = Mock.ofInstance(event => {});

    beforeEach(() => {
        onSelectorChangeMock.reset();
        onValidateSelectorMock.reset();
    });

    it('renders', () => {
        const renderResult = render(
            <FailureInstancePanelDetails
                path={path}
                snippet={snippet}
                onSelectorChange={onSelectorChangeMock.object}
                onValidateSelector={onValidateSelectorMock.object}
            ></FailureInstancePanelDetails>,
        );

        expect(renderResult).toBeTruthy();
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('triggers selector change on typing', () => {
        useOriginalReactElements('@fluentui/react', ['TextField']);
        useOriginalReactElements('@fluentui/react-components', ['Button']);
        const renderResult = render(
            <FailureInstancePanelDetails
                path={path}
                snippet={snippet}
                onSelectorChange={onSelectorChangeMock.object}
                onValidateSelector={onValidateSelectorMock.object}
            ></FailureInstancePanelDetails>,
        );

        const newPath = 'updated path';
        onSelectorChangeMock
            .setup(dc => dc(It.isAny(), It.isValue(newPath)))
            .verifiable(Times.once());

        const textField = renderResult.getByRole('textbox');
        fireEvent.change(textField, { target: { value: newPath } });
        onSelectorChangeMock.verifyAll();
    });

    it('triggers validation on click', async () => {
        const renderResult = render(
            <FailureInstancePanelDetails
                path={path}
                snippet={snippet}
                onSelectorChange={onSelectorChangeMock.object}
                onValidateSelector={onValidateSelectorMock.object}
            ></FailureInstancePanelDetails>,
        );

        onValidateSelectorMock.setup(getter => getter(It.isAny())).verifiable(Times.once());

        await userEvent.click(renderResult.getByRole('button'));
        onValidateSelectorMock.verifyAll();
    });
});
