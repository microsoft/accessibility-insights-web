// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow, ShallowWrapper } from 'enzyme';
import * as _ from 'lodash/index';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { IToggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { It, Mock, Times } from 'typemoq';

import { VisualizationToggle } from '../../../../../common/components/visualization-toggle';
import {
    IVisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../../common/configs/visualization-configuration-factory';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { TelemetryEventSource } from '../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../common/types/details-view-pivot-type';
import { IVisualizationStoreData } from '../../../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { PopupActionMessageCreator } from '../../../../../popup/scripts/actions/popup-action-message-creator';
import {
    DiagnosticViewToggle,
    IDiagnosticViewToggleProps,
    IDiagnosticViewToggleState,
} from '../../../../../popup/scripts/components/diagnostic-view-toggle';
import { DiagnosticViewClickHandler } from '../../../../../popup/scripts/handlers/diagnostic-view-toggle-click-handler';
import { ContentLink, ContentLinkDeps } from '../../../../../views/content/content-link';
import { EventStubFactory } from '../../../../Common/event-stub-factory';
import { ShortcutCommandsTestData } from '../../../../Common/sample-test-data';
import { VisualizationStoreDataBuilder } from '../../../../Common/visualization-store-data-builder';

describe('DiagnosticViewToggleTest', () => {
    const visualizationConfigurationFactory = new VisualizationConfigurationFactory();
    const testTelemetrySource: TelemetryEventSource = -1 as TelemetryEventSource;
    const eventStubFactory = new EventStubFactory();

    test('render spinner', () => {
        const type = VisualizationType.Headings;
        const data = new VisualizationStoreDataBuilder()
            .with('scanning', 'headings')
            .build();

        const props: IDiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource)
            .setupVisualizationStoreData(data)
            .build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        assertSpinner(wrapper);
        assertDetailsViewLink(wrapper, type);
        assertShortcut(wrapper, type, props);
    });

    test('render toggle when scanning', () => {
        const type = VisualizationType.Headings;
        const data = new VisualizationStoreDataBuilder()
            .with('scanning', 'landmarks')
            .build();

        const props: IDiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource)
            .setupVisualizationStoreData(data)
            .build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        assertVisualizationToggle(wrapper, type, data);
        assertDetailsViewLink(wrapper, type);
        assertShortcut(wrapper, type, props);
    });

    test('render toggle when not scanning', () => {
        const type = VisualizationType.Headings;

        const props: IDiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        assertVisualizationToggle(wrapper, type, props.visualizationStoreData, false);
        assertDetailsViewLink(wrapper, type);
        assertShortcut(wrapper, type, props);
    });

    test('verify content link rendered when newAssessmentExperience is on', () => {
        const type = VisualizationType.Headings;

        const props: IDiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource)
            .setupFeatureFlags({ [FeatureFlags.newAssessmentExperience]: true })
            .build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        assertVisualizationToggle(wrapper, type, props.visualizationStoreData, false);
        assertContentLink(wrapper, type);
        assertShortcut(wrapper, type, props);
    });

    test('verify details view link rendered when newAssessmentExperience is on, but the test does not have a guidance', () => {
        const type = VisualizationType.Issues;

        const props: IDiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource)
            .setupFeatureFlags({ [FeatureFlags.newAssessmentExperience]: true })
            .build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        assertVisualizationToggle(wrapper, type, props.visualizationStoreData, false);
        assertDetailsViewLink(wrapper, type);
        assertShortcut(wrapper, type, props);
    });

    test('verify details view link will open fastpass when Assessment enabled', () => {
        const type = VisualizationType.Issues;
        const event = eventStubFactory.createKeypressEvent();
        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource);
        const props: IDiagnosticViewToggleProps = propsBuilder
            .setupFeatureFlags({ [FeatureFlags.newAssessmentExperience]: true })
            .setupOpenDetailsViewCall(event, DetailsViewPivotType.fastPass)
            .build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        wrapper.find(Link).simulate('click', event);

        propsBuilder.verifyAll();
    });

    test('click the visualization toggle', () => {
        const type = VisualizationType.Headings;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupToggleVisualizationCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);

        wrapper.find(VisualizationToggle).simulate('click', event);

        propsBuilder.verifyAll();
    });

    test('click details view toggle when spinner is present', () => {
        const type = VisualizationType.Issues;
        const data = new VisualizationStoreDataBuilder()
            .with('scanning', 'issues')
            .build();

        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource)
            .setupVisualizationStoreData(data)
            .setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);
        wrapper.find(Link).simulate('click', event);

        propsBuilder.verifyAll();
    });

    test('click details view toggle when toggle is present', () => {
        const type = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const wrapper = shallow(<DiagnosticViewToggle {...props} />);
        wrapper.find(Link).simulate('click', event);

        propsBuilder.verifyAll();
    });

    test('command not found', () => {
        const type = VisualizationType.Color;
        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupShortcutCommands([]);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const component = new DiagnosticViewToggle(props);

        const renderAction = () => component.render();

        const commandName = visualizationConfigurationFactory.getConfiguration(type).chromeCommand;
        expect(renderAction).toThrowError(`Cannot find command for name: ${commandName}`);
    });

    test('componentDidMount', () => {
        const type = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const testObject = new DiagnosticViewToggle(props);

        testObject.componentDidMount();

        expect((testObject as any)._isMounted).toBeTruthy();
    });

    test('setFocus', () => {
        const focusMock = Mock.ofInstance(() => {});

        const type = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const component = React.createElement(DiagnosticViewToggle, props);

        const testObject = TestUtils.renderIntoDocument(component);

        (testObject as any)._isMounted = true;

        (testObject as any).state = {
            isFocused: true,
        };

        const forceUpdateMock = Mock.ofInstance(() => {});

        const testToggleMock: IToggle = {
            focus: focusMock.object,
        };

        forceUpdateMock
            .setup(fum => fum())
            .verifiable(Times.once());

        focusMock
            .setup(fM => fM())
            .verifiable(Times.once());

        testObject.forceUpdate = forceUpdateMock.object;
        const setFocusFunction = (testObject as any).setFocus;
        setFocusFunction(testToggleMock);

        expect((testObject as any)._toggle).toBe(testToggleMock);
        forceUpdateMock.verifyAll();
        focusMock.verifyAll();
    });

    test('onFocusHandler', () => {
        const type = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const component = React.createElement(DiagnosticViewToggle, props);

        const testObject = TestUtils.renderIntoDocument(component);

        (testObject as any)._isMounted = true;

        const onFocusHandlerFunction = (testObject as any).onFocusHandler;
        onFocusHandlerFunction();

        expect((testObject as any).state.isFocused).toBeTruthy();
    });

    test('onBlurHandler', () => {
        const type = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const component = React.createElement(DiagnosticViewToggle, props);

        const testObject = TestUtils.renderIntoDocument(component);

        (testObject as any)._isMounted = true;

        const onBlurHandlerFunction = (testObject as any).onBlurHandler;
        onBlurHandlerFunction();

        expect((testObject as any).state.isFocused).toBeFalsy();
    });

    test('addUserEventListener', () => {
        const type = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(type, testTelemetrySource).setupOpenDetailsViewCall(event);

        const props: IDiagnosticViewToggleProps = propsBuilder.build();

        const component = React.createElement(DiagnosticViewToggle, props);

        const testObject = TestUtils.renderIntoDocument(component);

        (testObject as any)._userEventListenerAdded = false;

        const addUserEventListenerFunction = (testObject as any).addUserEventListener;
        addUserEventListenerFunction();

        expect((testObject as any)._userEventListenerAdded).toBeTruthy();
        propsBuilder.addUserListenerVerifyAll();
    });

    function assertSpinner(wrapper: ShallowWrapper<IDiagnosticViewToggleProps, IDiagnosticViewToggleState>): void {
        const spinner = wrapper.find(Spinner);

        expect(spinner).toBeDefined();
        expect(spinner.props().size).toEqual(SpinnerSize.small);
    }

    function assertDetailsViewLink(
        wrapper: ShallowWrapper<IDiagnosticViewToggleProps, IDiagnosticViewToggleState>,
        type: VisualizationType,
    ): void {
        const detailsViewLink = wrapper.find(Link);

        const configuration = visualizationConfigurationFactory.getConfiguration(type);
        const displayableData = configuration.displayableData;

        expect(detailsViewLink).toBeDefined();
        expect(detailsViewLink.children().text()).toEqual(displayableData.linkToDetailsViewText);
        expect(detailsViewLink.props().href).toEqual('#');
    }

    function assertContentLink(
        wrapper: ShallowWrapper<IDiagnosticViewToggleProps, IDiagnosticViewToggleState>,
        type: VisualizationType,
    ): void {
        const detailsViewLink = wrapper.find(ContentLink);

        const configuration = visualizationConfigurationFactory.getConfiguration(type);
        const displayableData = configuration.displayableData;

        expect(detailsViewLink.props().linkText).toEqual(displayableData.linkToDetailsViewText);
    }

    function assertShortcut(
        wrapper: ShallowWrapper<IDiagnosticViewToggleProps, IDiagnosticViewToggleState>,
        type: VisualizationType,
        props: IDiagnosticViewToggleProps,
    ): void {
        const shortcutDiv = wrapper.findWhere(node => node.hasClass('shortcut-label'));

        expect(shortcutDiv).toBeDefined();

        const commandName = visualizationConfigurationFactory.getConfiguration(type).chromeCommand;
        const expectedCommand = _.find(props.shortcutCommands, command => command.name === commandName);

        expect(shortcutDiv.text()).toEqual(expectedCommand.shortcut);
    }

    function assertVisualizationToggle(
        wrapper: ShallowWrapper<IDiagnosticViewToggleProps, IDiagnosticViewToggleState>,
        type: VisualizationType,
        data: IVisualizationStoreData,
        isDisabled: boolean = true,
    ): void {
        const visualizationToggle = wrapper.find(VisualizationToggle);

        expect(visualizationToggle).toBeDefined();

        const configuration = visualizationConfigurationFactory.getConfiguration(type);
        const scanData = configuration.getStoreData(data.tests);

        expect(visualizationToggle.props().checked).toEqual(scanData.enabled);
        expect(visualizationToggle.props().disabled).toEqual(isDisabled);
    }
});

class DiagnosticViewTogglePropsBuilder {
    private type: VisualizationType;
    private data: IVisualizationStoreData = new VisualizationStoreDataBuilder().build();
    private visualizationConfigurationFactory = new VisualizationConfigurationFactory();
    private defaultVisualizationConfigurationFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
    private actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
    private clickHandlerMock = Mock.ofType(DiagnosticViewClickHandler);
    private telemetrySource: TelemetryEventSource;
    private shortcutCommands: chrome.commands.Command[] = ShortcutCommandsTestData;
    private querySelectorMock = Mock.ofInstance(selector => {});
    private addEventListenerMock = Mock.ofInstance((e, ev) => {});
    private featureFlags: IDictionaryStringTo<boolean> = {};
    private deps: ContentLinkDeps = {} as ContentLinkDeps;
    private configurationStub: IVisualizationConfiguration;

    constructor(type: VisualizationType, telemetrySource: TelemetryEventSource) {
        this.type = type;
        this.telemetrySource = telemetrySource;
    }

    public setupShortcutCommands(shortcutCommands: chrome.commands.Command[]): DiagnosticViewTogglePropsBuilder {
        this.shortcutCommands = shortcutCommands;
        return this;
    }

    public setupVisualizationStoreData(data: IVisualizationStoreData): DiagnosticViewTogglePropsBuilder {
        this.data = data;
        return this;
    }

    public setupOpenDetailsViewCall(event, pivot = DetailsViewPivotType.allTest): DiagnosticViewTogglePropsBuilder {
        this.actionMessageCreatorMock
            .setup(ac => ac.openDetailsView(event, this.type, this.telemetrySource, pivot))
            .verifiable(Times.once());

        return this;
    }

    public setupToggleVisualizationCall(event): DiagnosticViewTogglePropsBuilder {
        this.clickHandlerMock
            .setup(ch => ch.toggleVisualization(this.data, this.type, event))
            .verifiable(Times.once());

        return this;
    }

    public setupFeatureFlags(featureFlags: IDictionaryStringTo<boolean>): DiagnosticViewTogglePropsBuilder {
        this.featureFlags = featureFlags;
        return this;
    }

    public build(): IDiagnosticViewToggleProps {
        this.querySelectorMock
            .setup(q => q('.feedback-collapse-menu-button'))
            .returns(s => null)
            .verifiable(Times.once());

        this.addEventListenerMock
            .setup(a => a('keydown', It.isAny()))
            .returns((e, ev) => true)
            .verifiable(Times.once());

        const domMock = {
            querySelector: this.querySelectorMock.object,
            addEventListener: this.addEventListenerMock.object,
        };

        this.defaultVisualizationConfigurationFactoryMock
            .setup(v => v.getConfiguration(It.isAny()))
            .returns(type => this.configurationStub || this.visualizationConfigurationFactory.getConfiguration(type))
            .verifiable();

        const props: IDiagnosticViewToggleProps = {
            deps: this.deps,
            featureFlags: this.featureFlags,
            dom: domMock as any,
            type: this.type,
            visualizationConfigurationFactory: this.visualizationConfigurationFactory,
            visualizationStoreData: this.data,
            actionMessageCreator: this.actionMessageCreatorMock.object,
            clickHandler: this.clickHandlerMock.object,
            shortcutCommands: this.shortcutCommands,
            telemetrySource: this.telemetrySource,
        };

        return props;
    }

    public verifyAll(): void {
        this.actionMessageCreatorMock.verifyAll();
        this.clickHandlerMock.verifyAll();
    }

    public addUserListenerVerifyAll(): void {
        this.querySelectorMock.verifyAll();
        this.addEventListenerMock.verifyAll();
    }
}
