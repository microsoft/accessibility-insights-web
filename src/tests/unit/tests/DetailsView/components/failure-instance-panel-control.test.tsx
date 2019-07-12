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
    let addInstanceMock: IMock<(instanceData, test, step) => void>;
    let editInstanceMock: IMock<(instanceData, test, step, id) => void>;

    beforeEach(() => {
        addInstanceMock = Mock.ofInstance(() => {});
        editInstanceMock = Mock.ofInstance(() => {});
    });

    test('render FailureInstancePanelControl: add instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const rendered = shallow(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render FailureInstancePanelControl: undefined original instance', () => {
        const props = {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            actionType: CapturedInstanceActionType.CREATE,
            assessmentsProvider: Assessments,
            featureFlagStoreData: null,
        };
        const rendered = shallow(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render FailureInstancePanelControl: partial original instance', () => {
        const props = {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            actionType: CapturedInstanceActionType.CREATE,
            assessmentsProvider: Assessments,
            featureFlagStoreData: null,
            originalInstance: { failureDescription: 'original text' },
        };
        const rendered = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
        expect(rendered.state().currentInstance.path).toEqual('');
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

        expect(wrapper.state().currentInstance.failureDescription).toEqual(description);
    });

    test('openFailureInstancePanel', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        props.originalInstance.failureDescription = 'new text';
        props.originalInstance.path = 'new path';
        props.originalInstance.snippet = 'new snippet';
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
        expect(wrapper.state().currentInstance.failureDescription).toEqual(props.originalInstance.failureDescription);
        expect(wrapper.state().currentInstance.path).toEqual(props.originalInstance.path);
        expect(wrapper.state().currentInstance.snippet).toEqual(props.originalInstance.snippet);
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
        expect(wrapper.state().currentInstance.failureDescription).toEqual(description);
    });

    test('onSaveEditedFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.EDIT);
        props.instanceId = '1';
        props.editFailureInstance = editInstanceMock.object;

        const instanceData = {
            failureDescription: description,
            path: '',
            snippet: '',
        };

        editInstanceMock.setup(handler => handler(instanceData, props.test, props.step, props.instanceId)).verifiable(Times.once());

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
        expect(wrapper.state().currentInstance.failureDescription).toEqual(description);

        editInstanceMock.verifyAll();
    });

    test('onAddFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const instanceData = {
            failureDescription: description,
            path: '',
            snippet: '',
        };

        addInstanceMock.setup(handler => handler(instanceData, props.test, props.step)).verifiable(Times.once());
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
        expect(wrapper.state().currentInstance.failureDescription).toEqual(description);

        addInstanceMock.verifyAll();
    });

    function createPropsWithType(actionType: CapturedInstanceActionType): FailureInstancePanelControlProps {
        const featureData = {} as FeatureFlagStoreData;
        const failureDescription = '';
        const path = '';
        const snippet = '';

        return {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            actionType: actionType,
            assessmentsProvider: Assessments,
            featureFlagStoreData: featureData,
            originalInstance: { failureDescription, path, snippet },
        };
    }
});
