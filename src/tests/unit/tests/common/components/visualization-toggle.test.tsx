// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';

describe('VisualizationToggleTest', () => {
    test('render with no label', () => {
        const generatedProps = generateVisualizationToggleProps();
        const renderedToggle = shallow(<VisualizationToggle {...generatedProps} />);
        expect(renderedToggle.getElement()).toMatchSnapshot();
    });

    test('render with a specified label', () => {
        const generatedProps = generateVisualizationToggleProps('test-label');
        const renderedToggle = shallow(<VisualizationToggle {...generatedProps} />);
        expect(renderedToggle.getElement()).toMatchSnapshot();
    });

    test('verify onClick being called when toggle clicked', () => {
        const onClickMock = Mock.ofInstance(event => {});
        const clickEventStub = {};
        onClickMock.setup(onClick => onClick(clickEventStub)).verifiable(Times.once());

        const generatedProps = generateVisualizationToggleProps('test-label', onClickMock);
        const renderedToggle = shallow(<VisualizationToggle {...generatedProps} />);

        renderedToggle.simulate('click', clickEventStub);

        onClickMock.verifyAll();
    });

    function generateVisualizationToggleProps(
        labelValue?: string,
        passedOnClickMock?: IMock<(event) => void>,
    ): VisualizationToggleProps {
        const onClickMock: IMock<(event) => void> =
            passedOnClickMock ?? Mock.ofInstance(event => {});
        const componentRefStub: React.RefObject<any> = {} as React.RefObject<any>;
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
