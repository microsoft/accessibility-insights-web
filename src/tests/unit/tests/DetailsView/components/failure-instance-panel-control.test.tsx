// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { Assessments } from '../../../../../assessments/assessments';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { ActionAndCancelButtonsComponent } from '../../../../../DetailsView/components/action-and-cancel-buttons-component';
import {
    CapturedInstanceActionType,
    FailureInstancePanelControl,
    FailureInstancePanelControlProps,
} from '../../../../../DetailsView/components/failure-instance-panel-control';
import { GenericPanel } from '../../../../../DetailsView/components/generic-panel';

describe('FailureInstancePanelControlTest', () => {
    let addInstanceMock: IMock<(description, test, step) => void>;
    let editInstanceMock: IMock<(description, test, step, id) => void>;

    beforeEach(() => {
        addInstanceMock = Mock.ofInstance(() => {});
        editInstanceMock = Mock.ofInstance(() => {});
    });

    test('render FailureInstancePanelControl: add instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const rendered = shallow(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render FailureInstancePanelControl: edit instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.EDIT);
        const rendered = shallow(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('onFailureDescriptionChange', () => {
        const description = 'abc';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        wrapper
            .find(TextField)
            .props()
            .onChange(null, description);

        expect(wrapper.state().failureDescription).toEqual(description);
    });

    test('openFailureInstancePanel', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        props.originalText = 'original text';
        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        wrapper
            .find(TextField)
            .props()
            .onChange(null, 'a previously entered description');
        wrapper
            .find(ActionButton)
            .props()
            .onClick(null);

        expect(wrapper.state().isPanelOpen).toBe(true);
        expect(wrapper.state().failureDescription).toEqual(props.originalText);
    });

    test('closeFailureInstancePanel', () => {
        const description = 'description';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        wrapper
            .find(TextField)
            .props()
            .onChange(null, description);

        wrapper
            .find(GenericPanel)
            .props()
            .onDismiss();

        expect(wrapper.state().isPanelOpen).toBe(false);

        // This shouldn't be cleared because it stays briefly visible as the panel close animation happens
        expect(wrapper.state().failureDescription).toEqual(description);
    });

    test('onSaveEditedFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.EDIT);
        props.instanceId = '1';
        props.editFailureInstance = editInstanceMock.object;

        editInstanceMock.setup(handler => handler(description, props.test, props.step, props.instanceId)).verifiable(Times.once());

        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);

        wrapper
            .find(TextField)
            .props()
            .onChange(null, description);
        wrapper
            .find(ActionAndCancelButtonsComponent)
            .props()
            .primaryButtonOnClick(null);

        expect(wrapper.state().isPanelOpen).toBe(false);

        // This shouldn't be cleared because it stays briefly visible as the panel close animation happens
        expect(wrapper.state().failureDescription).toEqual(description);

        editInstanceMock.verifyAll();
    });

    test('onAddFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        addInstanceMock.setup(handler => handler(description, props.test, props.step)).verifiable(Times.once());
        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);

        wrapper
            .find(TextField)
            .props()
            .onChange(null, description);
        wrapper
            .find(ActionAndCancelButtonsComponent)
            .props()
            .primaryButtonOnClick(null);

        expect(wrapper.state().isPanelOpen).toBe(false);

        // This shouldn't be cleared because it stays briefly visible as the panel close animation happens
        expect(wrapper.state().failureDescription).toEqual(description);

        addInstanceMock.verifyAll();
    });

    function createPropsWithType(actionType: CapturedInstanceActionType): FailureInstancePanelControlProps {
        const featureData = {} as FeatureFlagStoreData;
        return {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            actionType: actionType,
            assessmentsProvider: Assessments,
            featureFlagStoreData: featureData,
        };
    }
});
