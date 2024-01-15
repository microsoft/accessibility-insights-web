// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from '@fluentui/react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as React from 'react';
import { IMock, Mock, It } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('VisualizationToggleTest', () => {
    mockReactComponents([Toggle]);
    test('render with no label', () => {
        const generatedProps = generateVisualizationToggleProps();
        const renderResult = render(<VisualizationToggle {...generatedProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Toggle]);
    });

    test('render with a specified label', () => {
        const generatedProps = generateVisualizationToggleProps('test-label');
        const renderResult = render(<VisualizationToggle {...generatedProps} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Toggle]);
    });

    test('verify onClick being called when toggle clicked', async () => {
        useOriginalReactElements('@fluentui/react', ['Toggle']);
        const onClickMock = Mock.ofInstance(event => {});

        onClickMock.setup(onClick => onClick(It.isAny()));

        const generatedProps = generateVisualizationToggleProps('test-label', onClickMock);
        const renderResult = render(<VisualizationToggle {...generatedProps} />);

        await userEvent.click(renderResult.getByRole('switch'));

        onClickMock.verifyAll();
    });

    function generateVisualizationToggleProps(
        labelValue?: string,
        passedOnClickMock?: IMock<(event) => void>,
    ): VisualizationToggleProps {
        const onClickMock: IMock<(event) => void> =
            passedOnClickMock ?? Mock.ofInstance(event => {});
        const componentRefStub: React.RefObject<any> = React.createRef(); // Use React.createRef() here
        const onBlurMock: IMock<(event) => void> = Mock.ofInstance(event => {});
        const onFocusMock: IMock<(event) => void> = Mock.ofInstance(event => {});
        const result = {
            checked: false,
            onClick: onClickMock.object,
            disabled: true,
            className: 'my test class',
            visualizationName: 'visualizationName',
            onText: 'On',
            offText: 'Off',
            componentRef: componentRefStub,
            onFocus: onFocusMock.object,
            onBlur: onBlurMock.object,
            'data-automation-id': 'test-automation-id',
        } as VisualizationToggleProps;

        if (labelValue) {
            result.label = labelValue;
        }

        return result;
    }
});
