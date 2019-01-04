// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { Assessments } from '../../../../assessments/assessments';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { ActionAndCancelButtonsComponent } from '../../../../DetailsView/components/action-and-cancel-buttons-component';
import { CapturedInstanceActionType, FailureInstancePanelControl, IFailureInstancePanelControlProps } from '../../../../DetailsView/components/failure-instance-panel-control';
import { GenericPanel } from '../../../../DetailsView/components/generic-panel';

describe('FailureInstancePanelControlTest', () => {
    let addInstanceMock: IMock<(description, test, step) => void>;
    let editInstanceMock: IMock<(description, test, step, id) => void>;

    beforeEach(() => {
        addInstanceMock = Mock.ofInstance((description, test, step) => { });
        editInstanceMock = Mock.ofInstance((description, test, step, id) => { });
    });

    test('render FailureInstancePanelControl: add instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const rendered = shallow(<FailureInstancePanelControl {...props}/>);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('render FailureInstancePanelControl: edit instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.EDIT);

        const rendered = shallow(<FailureInstancePanelControl {...props}/>);
        expect(rendered.debug()).toMatchSnapshot();
    });

    test('onFailureDescriptionChange', () => {
        const description = 'abc';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const wrapper = shallow(<FailureInstancePanelControl {...props} />);
        wrapper.find(TextField).props().onChanged(description);

        expect(wrapper.state().failureDescription).toEqual(description);
    });

    test('openFailureInstancePanel', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        props.originalText = 'ot';
        const wrapper = shallow(<FailureInstancePanelControl {...props} />);
        wrapper.find(ActionButton).props().onClick(null);

        expect(wrapper.state().isPanelOpen).toBe(true);
        expect(wrapper.state().failureDescription).toEqual(props.originalText);
    });

    test('closeFailureInstancePanel', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const wrapper = shallow(<FailureInstancePanelControl {...props} />);
        wrapper.find(GenericPanel).props().onDismiss();

        expect(wrapper.state().isPanelOpen).toBe(false);
        expect(wrapper.state().failureDescription).toEqual('');
    });

    test('onSaveEditedFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.EDIT);
        props.instanceId = '1';
        props.editFailureInstance = editInstanceMock.object;

        editInstanceMock
            .setup(handler => handler(description, props.test, props.step, props.instanceId))
            .verifiable(Times.once());

        const wrapper = Enzyme.shallow(<FailureInstancePanelControl {...props} />);

        wrapper.find(TextField).props().onChanged(description);
        wrapper.find(ActionAndCancelButtonsComponent).props().primaryButtonOnClick(null);

        expect(wrapper.state().isPanelOpen).toBe(false);
        expect(wrapper.state().failureDescription).toEqual('');
        editInstanceMock.verifyAll();
    });

    test('onAddFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        addInstanceMock
            .setup(handler => handler(description, props.test, props.step))
            .verifiable(Times.once());

        const wrapper = Enzyme.shallow(<FailureInstancePanelControl {...props} />);

        wrapper.find(TextField).props().onChanged(description);
        wrapper.find(ActionAndCancelButtonsComponent).props().primaryButtonOnClick(null);

        expect(wrapper.state().isPanelOpen).toBe(false);
        expect(wrapper.state().failureDescription).toEqual('');
        addInstanceMock.verifyAll();
    });

    function createPropsWithType(type: CapturedInstanceActionType): IFailureInstancePanelControlProps {
        return {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            actionType: type,
            assessmentsProvider: Assessments,
        };
    }
});
