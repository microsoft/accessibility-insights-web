import { fireEvent, render, act } from '@testing-library/react';
import { ActionButton, Link, TextField } from '@fluentui/react';
import { Assessments } from 'assessments/assessments';
import { FlaggedComponent } from 'common/components/flagged-component';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { ActionAndCancelButtonsComponent } from 'DetailsView/components/action-and-cancel-buttons-component';
import {
    FailureInstancePanelControl,
    FailureInstancePanelControlProps,
} from 'DetailsView/components/failure-instance-panel-control';
import {
    FailureInstancePanelDetails,
    FailureInstancePanelDetailsProps,
} from 'DetailsView/components/failure-instance-panel-details';
import { GenericPanel } from 'DetailsView/components/generic-panel';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');
jest.mock('common/components/flagged-component');
jest.mock('DetailsView/components/generic-panel');
jest.mock('DetailsView/components/action-and-cancel-buttons-component');
jest.mock('DetailsView/components/failure-instance-panel-details');
describe('FailureInstancePanelControlTest', () => {
    mockReactComponents([
        ActionButton,
        Link,
        GenericPanel,
        FlaggedComponent,
        TextField,
        ActionAndCancelButtonsComponent,
        FailureInstancePanelDetails,
    ]);
    let addPathForValidationMock: IMock<(path) => void>;
    let addInstanceMock: IMock<(instanceData, test, step) => void>;
    let editInstanceMock: IMock<(instanceData, test, step, id) => void>;
    let clearPathSnippetDataMock: IMock<() => void>;

    beforeEach(() => {
        addInstanceMock = Mock.ofInstance(() => {});
        editInstanceMock = Mock.ofInstance(() => {});
        addPathForValidationMock = Mock.ofInstance(() => {});
        clearPathSnippetDataMock = Mock.ofInstance(() => {});
    });

    test('render FailureInstancePanelControl: create without instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const renderResult = render(<FailureInstancePanelControl {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render FailureInstancePanelControl: partial original instance', () => {
        const props = {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            addPathForValidation: addPathForValidationMock.object,
            clearPathSnippetData: clearPathSnippetDataMock.object,
            actionType: CapturedInstanceActionType.CREATE,
            assessmentsProvider: Assessments,
            featureFlagStoreData: null,
            failureInstance: { failureDescription: 'original text' },
        };
        const renderResult = render(<FailureInstancePanelControl {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        const flaggedProps = getMockComponentClassPropsForCall(FlaggedComponent);
        expect(flaggedProps.enableJSXElement.props.path).toBeUndefined();
    });

    test('render FailureInstancePanelControl: edit without instance', () => {
        const props = createPropsWithType(CapturedInstanceActionType.EDIT);
        const renderResult = render(<FailureInstancePanelControl {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('closeFailureInstancePanel', () => {
        const description = 'description';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const renderResult = render(<FailureInstancePanelControl {...props} />);
        const genericPanelProp = getMockComponentClassPropsForCall(GenericPanel);
        getMockComponentClassPropsForCall(TextField).onChange(null, description);
        genericPanelProp.onDismiss();
        expect(genericPanelProp.isOpen).toBe(false);
        const textFeildProp2 = getMockComponentClassPropsForCall(TextField, 2);
        // This shouldn't be cleared because it stays briefly visible as the panel close animation happens
        expect(textFeildProp2.value).toEqual(description);

        clearPathSnippetDataMock.verify(handler => handler(), Times.exactly(2));
    });

    test('onFailureDescriptionChange', () => {
        useOriginalReactElements('@fluentui/react', [
            'TextField',
            'Panel',
            'ActionButton',
            'Link',
            'DefaultButton',
        ]);
        useOriginalReactElements('DetailsView/components/generic-panel', ['GenericPanel']);
        useOriginalReactElements('common/components/flagged-component', ['FlaggedComponent']);
        useOriginalReactElements('DetailsView/components/action-and-cancel-buttons-component', [
            'ActionAndCancelButtonsComponent',
        ]);
        useOriginalReactElements('DetailsView/components/failure-instance-panel-details', [
            'FailureInstancePanelDetails',
        ]);
        const description = 'abc';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const renderResult = render(<FailureInstancePanelControl {...props} />);
        fireEvent.click(renderResult.getByRole('button'));
        const textField = renderResult.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(textField, { target: { value: description } });
        //getMockComponentClassPropsForCall(TextField).onChange(null, description);
        expect(textField.value).toBe(description);
        //const mockPropsTextField2 = getMockComponentClassPropsForCall(TextField, 2);
        //expect(mockPropsTextField2.value).toEqual(description);
    });

    test('onSelectorChange ', () => {
        const selector = 'some selector';
        const eventStub = null;
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        props.featureFlagStoreData = { manualInstanceDetails: true };
        props.failureInstance.path = '';
        const renderResult = render(<FailureInstancePanelControl {...props} />);
        fireEvent.click(renderResult.getByRole('button'));
        //renderResult.debug();
        const cssSelector = renderResult.getByLabelText('CSS Selector') as HTMLInputElement;
        fireEvent.change(cssSelector, { target: { value: selector } });
        expect(cssSelector.value).toBe(selector);
        // //const flaggedComponent = renderResult.container.querySelector(FlaggedComponent);
        // const flaggedComponentProps = getMockComponentClassPropsForCall(FlaggedComponent);
        // const failureInstancePanelDetails = flaggedComponentProps.enableJSXElement;
        // const failureInstancePanelDetailsProps = failureInstancePanelDetails.props as FailureInstancePanelDetailsProps;
        // act(() => {
        //     failureInstancePanelDetailsProps.onSelectorChange(eventStub, selector);
        // });
        // const calls = (FlaggedComponent as any).mock || (FlaggedComponent as any).render.mock;
        // console.log(calls);

        // const flaggedProps = getMockComponentClassPropsForCall(FlaggedComponent);
        // console.log(flaggedProps.enableJSXElement.props);
        // expect(flaggedProps.enableJSXElement.props.path).toBe(selector);
        // //expect(renderResult.state().currentInstance.path).toEqual(selector);
    });

    test('onValidateSelector ', () => {
        const eventStub = null;
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const failureInstance = {
            failureDescription: 'new text',
            path: 'some selector',
            snippet: null,
        };

        props.failureInstance = failureInstance;
        props.featureFlagStoreData = { manualInstanceDetails: true };
        addPathForValidationMock
            .setup(handler => handler(failureInstance.path))
            .verifiable(Times.once());

        const renderResult = render(<FailureInstancePanelControl {...props} />);
        fireEvent.click(renderResult.getByRole('button'));
        fireEvent.click(renderResult.getByText('Validate CSS selector'));
        // const flaggedComponent = renderResult.container.querySelector(FlaggedComponent);
        // const flaggedComponentProps = flaggedComponent.props();
        // const failureInstancePanelDetails = flaggedComponentProps.enableJSXElement;
        // const failureInstancePanelDetailsProps = failureInstancePanelDetails.props as FailureInstancePanelDetailsProps;
        // failureInstancePanelDetailsProps.onValidateSelector(eventStub);

        addPathForValidationMock.verifyAll();
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
        props.featureFlagStoreData = { manualInstanceDetails: true };
        const renderResult = render(<FailureInstancePanelControl {...props} />);
        fireEvent.click(renderResult.getByRole('button'));

        expect(renderResult.container.querySelector('.failureInstancePanel')).not.toBeNull;
        const failureDescription = renderResult.getByLabelText('Comment') as HTMLInputElement;
        expect(failureDescription.value).toEqual(props.failureInstance.failureDescription);
        const pathField = renderResult.getByLabelText('CSS Selector') as HTMLInputElement;
        expect(pathField.value).toEqual(props.failureInstance.path);
        const snippetText = renderResult.getByText(props.failureInstance.snippet);
        expect(snippetText).not.toBeNull();
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

        editInstanceMock
            .setup(handler => handler(instanceData, props.test, props.step, props.instanceId))
            .verifiable(Times.once());

        const renderResult = render(<FailureInstancePanelControl {...props} />);
        fireEvent.click(renderResult.getByRole('button'));
        const textField = renderResult.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(textField, { target: { value: description } });
        fireEvent.click(renderResult.getByText('Save'));
        //renderResult.container.querySelector(TextField).props().onChange(null, description);

        //renderResult.container.querySelector(ActionAndCancelButtonsComponent).props().primaryButtonOnClick(null);

        //expect(renderResult.state().isPanelOpen).toBe(false);
        expect(renderResult.container.querySelector('.failureInstancePanel')).not.toBeNull;

        // This shouldn't be cleared because it stays briefly visible as the panel close animation happens
        // expect(renderResult.state().currentInstance.failureDescription).toEqual(description);

        editInstanceMock.verifyAll();
        clearPathSnippetDataMock.verify(handler => handler(), Times.exactly(2));
    });

    test('onAddFailureInstance', () => {
        const description = 'text';
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);

        const instanceData = {
            failureDescription: description,
            path: null,
            snippet: null,
        };

        addInstanceMock
            .setup(handler => handler(instanceData, props.test, props.step))
            .verifiable(Times.once());

        const renderResult = render(<FailureInstancePanelControl {...props} />);
        fireEvent.click(renderResult.getByRole('button'));
        const textField = renderResult.getByRole('textbox') as HTMLInputElement;
        fireEvent.change(textField, { target: { value: description } });
        fireEvent.click(renderResult.getByText('Add failed instance'));
        //renderResult.container.querySelector(TextField).props().onChange(null, description);

        // renderResult.container.querySelector(ActionAndCancelButtonsComponent).props().primaryButtonOnClick(null);

        // expect(renderResult.state().isPanelOpen).toBe(false);
        expect(renderResult.container.querySelector('.failureInstancePanel')).not.toBeNull;
        // This shouldn't be cleared because it stays briefly visible as the panel close animation happens
        //  expect(renderResult.state().currentInstance.failureDescription).toEqual(description);

        addInstanceMock.verifyAll();
        clearPathSnippetDataMock.verify(handler => handler(), Times.exactly(2));
    });

    test('componentDidMount clears store', () => {
        const props = createPropsWithType(CapturedInstanceActionType.CREATE);
        const failureInstance = {
            failureDescription: null,
            path: 'inputed path',
            snippet: 'snippet for path',
        };
        props.failureInstance = failureInstance;

        const component = new FailureInstancePanelControl(props);
        component.componentDidMount();

        clearPathSnippetDataMock.verify(handler => handler(), Times.exactly(1));
    });

    test('componentDidUpdate reassigns state', () => {
        const prevProps = createPropsWithType(CapturedInstanceActionType.CREATE);
        const newProps = createPropsWithType(CapturedInstanceActionType.CREATE);
        const newFailureInstance = {
            failureDescription: null,
            path: 'inputed path',
            snippet: 'snippet for path',
        };
        prevProps.failureInstance.path = '';
        newProps.failureInstance = newFailureInstance;
        newProps.featureFlagStoreData = { manualInstanceDetails: true };
        prevProps.featureFlagStoreData = { manualInstanceDetails: true };
        const { rerender, getByLabelText, getByText, getByRole } = render(
            <FailureInstancePanelControl {...prevProps} />,
        );
        fireEvent.click(getByRole('button'));
        const pathField = getByLabelText('CSS Selector') as HTMLInputElement;
        expect(pathField.value).toEqual(prevProps.failureInstance.path);
        const emptySnippetText = getByText(
            'Code snippet will auto-populate based on the CSS selector input.',
        );
        expect(emptySnippetText).not.toBeNull();
        // const firstStateCurrentInstance = (renderResult.instance() as FailureInstancePanelControl).state.currentInstance;
        rerender(<FailureInstancePanelControl {...newProps} />);
        expect(pathField.value).toEqual(newProps.failureInstance.path);
        const filledSnippetText = getByText(newProps.failureInstance.snippet);
        expect(filledSnippetText).not.toBeNull();
        //(renderResult.instance() as FailureInstancePanelControl).componentDidUpdate(prevProps);
        // const secondStateCurrentInstance = (renderResult.instance() as FailureInstancePanelControl).state.currentInstance;
        //const firstStateCurrentInstance = (compInstance as any).state.currentInstance;
        //expect(firstStateCurrentInstance).toEqual(prevProps.failureInstance);
        // expect(secondStateCurrentInstance).toEqual(newProps.failureInstance);
    });

    function createPropsWithType(
        actionType: CapturedInstanceActionType,
    ): FailureInstancePanelControlProps {
        const featureData = {} as FeatureFlagStoreData;
        const emptyFailureInstance = {
            failureDescription: null,
            path: null,
            snippet: null,
        };

        return {
            step: 'missingHeadings',
            test: VisualizationType.HeadingsAssessment,
            addFailureInstance: addInstanceMock.object,
            addPathForValidation: addPathForValidationMock.object,
            clearPathSnippetData: clearPathSnippetDataMock.object,
            actionType: actionType,
            assessmentsProvider: Assessments,
            featureFlagStoreData: featureData,
            failureInstance: emptyFailureInstance,
        };
    }
});
