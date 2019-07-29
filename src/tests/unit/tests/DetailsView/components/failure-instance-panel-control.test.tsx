// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { Assessments } from '../../../../../assessments/assessments';
import { FlaggedComponent } from '../../../../../common/components/flagged-component';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { ActionAndCancelButtonsComponent } from '../../../../../DetailsView/components/action-and-cancel-buttons-component';
import {
    CapturedInstanceActionType,
    FailureInstancePanelControl,
    FailureInstancePanelControlProps,
} from '../../../../../DetailsView/components/failure-instance-panel-control';
import { FailureInstancePanelDetailsProps } from '../../../../../DetailsView/components/failure-instance-panel-details';
import { GenericPanel } from '../../../../../DetailsView/components/generic-panel';

describe('FailureInstancePanelControlTest', () => {
    let addPathForValidationMock: IMock<(path) => void>;
    let addInstanceMock: IMock<(instanceData, test, step) => void>;
    let editInstanceMock: IMock<(instanceData, test, step, id) => void>;

    beforeEach(() => {
        addInstanceMock = Mock.ofInstance(() => {});
        editInstanceMock = Mock.ofInstance(() => {});
        addPathForValidationMock = Mock.ofInstance(() => {});
    });

    test('render FailureInstancePanelControl: create without instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const rendered = shallow(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render FailureInstancePanelControl: partial original instance', () => {
        const props = {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            addPathForValidation: addPathForValidationMock.object,
            actionType: CapturedInstanceActionType.CREATE,
            assessmentsProvider: Assessments,
            featureFlagStoreData: null,
            failureInstance: { failureDescription: 'original text' },
        };
        const rendered = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
        expect(rendered.state().currentInstance.path).toBeNull();
    });

    test('render FailureInstancePanelControl: edit without instance', () => {
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

    test('onSelectorChange ', () => {
        const selector = 'some selector';
        const eventStub = null;
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        const flaggedComponent = wrapper.find(FlaggedComponent);
        const flaggedComponentProps = flaggedComponent.props();
        const failureInstancePanelDetails = flaggedComponentProps.enableJSXElement;
        const failureInstancePanelDetailsProps = failureInstancePanelDetails.props as FailureInstancePanelDetailsProps;
        failureInstancePanelDetailsProps.onSelectorChange(eventStub, selector);

        expect(wrapper.state().currentInstance.path).toEqual(selector);
    });

    test('onValidateSelector ', () => {
        const selector = 'some selector';
        const snippet = 'snippet for ' + selector;
        const eventStub = null;
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const failureInstance = {
            failureDescription: 'new text',
            path: selector,
            snippet: null,
        };

        props.failureInstance = failureInstance;

        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        const flaggedComponent = wrapper.find(FlaggedComponent);
        const flaggedComponentProps = flaggedComponent.props();
        const failureInstancePanelDetails = flaggedComponentProps.enableJSXElement;
        const failureInstancePanelDetailsProps = failureInstancePanelDetails.props as FailureInstancePanelDetailsProps;
        failureInstancePanelDetailsProps.onValidateSelector(eventStub);

        expect(wrapper.state().currentInstance.snippet).toEqual(snippet);
    });

    test('openFailureInstancePanel', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const eventStub = null;
        const failureInstance = {
            failureDescription: 'new text',
            path: 'new path',
            snippet: 'new snippet',
        };
        props.failureInstance = failureInstance;
        const wrapper = shallow<FailureInstancePanelControl>(<FailureInstancePanelControl {...props} />);
        wrapper
            .find(TextField)
            .props()
            .onChange(eventStub, 'a previously entered description');
        wrapper
            .find(ActionButton)
            .props()
            .onClick(eventStub);

        expect(wrapper.state().isPanelOpen).toBe(true);
        expect(wrapper.state().currentInstance.failureDescription).toEqual(props.failureInstance.failureDescription);
        expect(wrapper.state().currentInstance.path).toEqual(props.failureInstance.path);
        expect(wrapper.state().currentInstance.snippet).toEqual(props.failureInstance.snippet);
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
            path: null,
            snippet: null,
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
            path: null,
            snippet: null,
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

        return {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            addPathForValidation: addPathForValidationMock.object,
            actionType: actionType,
            assessmentsProvider: Assessments,
            featureFlagStoreData: featureData,
        };
    }
});
