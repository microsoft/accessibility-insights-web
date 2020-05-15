// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { IToggleProps, Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    VisualizationToggle,
    VisualizationToggleProps,
} from '../../../../../common/components/visualization-toggle';

describe('VisualizationToggleTest', () => {
    test('constructor', () => {
        const testObject = new VisualizationToggle({} as VisualizationToggleProps);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render no optional props', () => {
        const props: VisualizationToggleProps = new VisualizationTogglePropsBuilder().build();

        const wrapper = Enzyme.shallow(<VisualizationToggle {...props} />);

        const toggle = wrapper.find(Toggle);

        expect(toggle).toBeDefined();

        const expectedProps = visualizationTogglePropsToToggleProps(props);
        expect(toggle.props()).toEqual(expectedProps);
    });

    test('render all props', () => {
        const props: VisualizationToggleProps = new VisualizationTogglePropsBuilder()
            .setLabel('my test label')
            .setClassName('my test class')
            .setDisabled(true)
            .setDataAutomationId('test-automation-id')
            .build();

        const wrapper = Enzyme.shallow(<VisualizationToggle {...props} />);

        const toggle = wrapper.find(Toggle);

        expect(toggle).toBeDefined();

        const expectedProps = visualizationTogglePropsToToggleProps(props);
        expect(toggle.props()).toEqual(expectedProps);
    });

    test('verify onClick being called when toggle clicked', () => {
        const onClickMock = Mock.ofInstance(event => {});
        const clickEventStub = {};
        onClickMock.setup(onClick => onClick(clickEventStub)).verifiable(Times.once());

        const props: VisualizationToggleProps = new VisualizationTogglePropsBuilder()
            .setLabel('my test label')
            .setClassName('my test class')
            .setDisabled(true)
            .setOnClickMock(onClickMock)
            .build();

        const wrapper = Enzyme.shallow(<VisualizationToggle {...props} />);

        wrapper.find(Toggle).simulate('click', clickEventStub);

        onClickMock.verifyAll();
    });

    function visualizationTogglePropsToToggleProps(props: VisualizationToggleProps): IToggleProps {
        const result: IToggleProps = {
            checked: props.checked,
            onClick: props.onClick,
            disabled: props.disabled,
            label: props.label,
            className: props.className,
            onText: 'On',
            offText: 'Off',
            ariaLabel: props.visualizationName,
            componentRef: props.componentRef,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            'data-automation-id': props['data-automation-id'],
        };

        return result;
    }
});

class VisualizationTogglePropsBuilder {
    private checked: boolean = false;
    private onClickMock: IMock<(event) => void> = Mock.ofInstance(event => {});
    private disabled: boolean;
    private label: string;
    private className: string;
    private dataAutomationId: string;
    private visualizationName: string = 'visualizationName';
    private componentRefStub: React.RefObject<any> = {} as React.RefObject<any>;
    private onBlurMock: IMock<(event) => void> = Mock.ofInstance(event => {});
    private onFocusMock: IMock<(event) => void> = Mock.ofInstance(event => {});

    public setClassName(className: string): VisualizationTogglePropsBuilder {
        this.className = className;
        return this;
    }

    public setDataAutomationId(dataAutomationId: string): VisualizationTogglePropsBuilder {
        this.dataAutomationId = dataAutomationId;
        return this;
    }

    public setLabel(label: string): VisualizationTogglePropsBuilder {
        this.label = label;
        return this;
    }

    public setDisabled(isDisabled: boolean): VisualizationTogglePropsBuilder {
        this.disabled = isDisabled;
        return this;
    }

    public setOnClickMock(onClickMock: IMock<(event) => void>): VisualizationTogglePropsBuilder {
        this.onClickMock = onClickMock;
        return this;
    }

    public build(): VisualizationToggleProps {
        const props: VisualizationToggleProps = {
            onText: 'On',
            offText: 'Off',
            checked: this.checked,
            onClick: this.onClickMock.object,
            visualizationName: this.visualizationName,
            componentRef: this.componentRefStub,
            onFocus: this.onFocusMock.object,
            onBlur: this.onBlurMock.object,
        };

        if (this.disabled != null) {
            props.disabled = this.disabled;
        }

        if (this.label != null) {
            props.label = this.label;
        }

        if (this.className != null) {
            props.className = this.className;
        }

        if (this.dataAutomationId != null) {
            props['data-automation-id'] = this.dataAutomationId;
        }

        return props;
    }
}
