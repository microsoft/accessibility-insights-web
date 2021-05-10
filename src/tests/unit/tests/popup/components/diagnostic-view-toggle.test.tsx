// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationToggle } from 'common/components/visualization-toggle';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { mount, shallow } from 'enzyme';
import { Link } from 'office-ui-fabric-react';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import {
    DiagnosticViewToggle,
    DiagnosticViewToggleProps,
} from 'popup/components/diagnostic-view-toggle';
import { DiagnosticViewClickHandler } from 'popup/handlers/diagnostic-view-toggle-click-handler';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { ContentLinkDeps } from 'views/content/content-link';
import { ContentProvider } from 'views/content/content-page';
import { EventStubFactory } from '../../../common/event-stub-factory';
import { ShortcutCommandsTestData } from '../../../common/sample-test-data';
import { VisualizationStoreDataBuilder } from '../../../common/visualization-store-data-builder';

describe('DiagnosticViewToggleTest', () => {
    const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory();
    const testTelemetrySource: TelemetryEventSource = -1 as TelemetryEventSource;
    const eventStubFactory = new EventStubFactory();

    describe('renders', () => {
        it('spinner while scanning', () => {
            const visualizationType = VisualizationType.Headings;
            const data = new VisualizationStoreDataBuilder().with('scanning', 'headings').build();

            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupVisualizationStoreData(data)
                .build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('toggle when scanning for a different visualization', () => {
            const visualizationType = VisualizationType.Headings;
            const data = new VisualizationStoreDataBuilder().with('scanning', 'landmarks').build();

            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupVisualizationStoreData(data)
                .build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('toggle when not scanning', () => {
            const visualizationType = VisualizationType.Headings;

            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('details view link when the test does not have a guidance', () => {
            const visualizationType = VisualizationType.Issues;

            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction: ', () => {
        it('handles click on details view link, it will open FastPass when Assessment enabled', () => {
            const visualizationType = VisualizationType.Issues;
            const event = eventStubFactory.createKeypressEvent();
            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            );
            const props: DiagnosticViewToggleProps = propsBuilder
                .setupFeatureFlags({ 'test-flag': true })
                .setupOpenDetailsViewCall(event)
                .build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);

            wrapper.find(Link).simulate('click', event);

            propsBuilder.verifyAll();
        });

        it('handles click the visualization toggle', () => {
            const visualizationType = VisualizationType.Headings;
            const event = eventStubFactory.createKeypressEvent();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).setupToggleVisualizationCall(event);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);

            wrapper.find(VisualizationToggle).simulate('click', event);

            propsBuilder.verifyAll();
        });

        it('handles click on the link when spinner is present', () => {
            const visualizationType = VisualizationType.Issues;
            const data = new VisualizationStoreDataBuilder().with('scanning', 'issues').build();

            const event = eventStubFactory.createKeypressEvent();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupVisualizationStoreData(data)
                .setupOpenDetailsViewCall(event);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);
            wrapper.find(Link).simulate('click', event);

            propsBuilder.verifyAll();
        });

        it('handles click on the link when toggle is present', () => {
            const visualizationType = VisualizationType.Issues;
            const event = eventStubFactory.createKeypressEvent();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).setupOpenDetailsViewCall(event);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);
            wrapper.find(Link).simulate('click', event);

            propsBuilder.verifyAll();
        });

        it('handles command not found', () => {
            const visualizationType = VisualizationType.Color;
            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).setupShortcutCommands([]);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const component = new DiagnosticViewToggle(props);

            const renderAction = () => component.render();

            const commandName =
                visualizationConfigurationFactory.getConfiguration(visualizationType).chromeCommand;
            expect(renderAction).toThrowError(`Cannot find command for name: ${commandName}`);
        });

        it('handles no chromeCommand defined', () => {
            const visualizationType = VisualizationType.NeedsReview;
            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).setupShortcutCommands([]);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const wrapper = shallow(<DiagnosticViewToggle {...props} />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('life cycle events', () => {
        it('sets focus when componentDidMount', () => {
            const visualizationType = VisualizationType.TabStops;
            const event = eventStubFactory.createKeypressEvent();

            const depsMock = createDepsMock();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupOpenDetailsViewCall(event)
                .setupDeps(depsMock.object);

            const props = propsBuilder.build();

            const wrapper = mount(<DiagnosticViewToggle {...props} />);
            wrapper.setState({
                isFocused: true,
            });
            const toggle = wrapper.find(VisualizationToggle).props().componentRef.current;
            jest.spyOn(toggle, 'focus');

            wrapper.instance().componentDidMount();

            expect(toggle.focus).toHaveBeenCalledTimes(1);
        });

        it('sets focus when componentDidUpdate', () => {
            const visualizationType = VisualizationType.TabStops;
            const event = eventStubFactory.createKeypressEvent();

            const depsMock = createDepsMock();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupOpenDetailsViewCall(event)
                .setupDeps(depsMock.object);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const wrapper = mount(<DiagnosticViewToggle {...props} />);
            wrapper.setState({
                isFocused: true,
            });
            const toggle = wrapper.find(VisualizationToggle).props().componentRef.current;
            jest.spyOn(toggle, 'focus');

            wrapper.instance().componentDidUpdate(props, props);

            expect(toggle.focus).toHaveBeenCalledTimes(1);
        });
    });

    describe('focus-like events', () => {
        it('handles onFocus event on the VisualizationToggle', () => {
            const visualizationType = VisualizationType.TabStops;
            const event = eventStubFactory.createKeypressEvent();

            const depsMock = createDepsMock();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupOpenDetailsViewCall(event)
                .setupDeps(depsMock.object);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const component = React.createElement(DiagnosticViewToggle, props);

            const testObject = TestUtils.renderIntoDocument(component);

            (testObject as any)._isMounted = true;

            const onFocusHandlerFunction = (testObject as any).onFocusHandler;
            onFocusHandlerFunction();

            expect((testObject as any).state.isFocused).toBeTruthy();
        });

        it('onBlurHandler', () => {
            const visualizationType = VisualizationType.TabStops;
            const event = eventStubFactory.createKeypressEvent();

            const depsMock = createDepsMock();

            const propsBuilder = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            )
                .setupOpenDetailsViewCall(event)
                .setupDeps(depsMock.object);

            const props: DiagnosticViewToggleProps = propsBuilder.build();

            const component = React.createElement(DiagnosticViewToggle, props);

            const testObject = TestUtils.renderIntoDocument(component);

            (testObject as any)._isMounted = true;

            const onBlurHandlerFunction = (testObject as any).onBlurHandler;
            onBlurHandlerFunction();

            expect((testObject as any).state.isFocused).toBeFalsy();
        });
    });

    it('addUserEventListener', () => {
        const visualizationType = VisualizationType.TabStops;
        const event = eventStubFactory.createKeypressEvent();

        const depsMock = createDepsMock();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(
            visualizationType,
            testTelemetrySource,
        )
            .setupOpenDetailsViewCall(event)
            .setupDeps(depsMock.object);

        const props: DiagnosticViewToggleProps = propsBuilder.build();

        const component = React.createElement(DiagnosticViewToggle, props);

        const testObject = TestUtils.renderIntoDocument(component);

        (testObject as any)._userEventListenerAdded = false;

        const addUserEventListenerFunction = (testObject as any).addUserEventListener;
        addUserEventListenerFunction();

        expect((testObject as any).userEventListenerAdded).toBe(true);
        propsBuilder.addUserListenerVerifyAll();
    });

    function createDepsMock(): IMock<ContentLinkDeps> {
        const contentProviderMock = Mock.ofType<ContentProvider>();
        const depsMock = Mock.ofType<ContentLinkDeps>();
        depsMock.setup(deps => deps.contentProvider).returns(() => contentProviderMock.object);

        return depsMock;
    }
});

class DiagnosticViewTogglePropsBuilder {
    private visualizationType: VisualizationType;
    private data: VisualizationStoreData = new VisualizationStoreDataBuilder().build();
    private visualizationConfigurationFactory = new WebVisualizationConfigurationFactory();
    private defaultVisualizationConfigurationFactoryMock =
        Mock.ofType<VisualizationConfigurationFactory>();
    private actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
    private clickHandlerMock = Mock.ofType(DiagnosticViewClickHandler);
    private telemetrySource: TelemetryEventSource;
    private shortcutCommands: chrome.commands.Command[] = ShortcutCommandsTestData;
    private querySelectorMock = Mock.ofInstance(selector => {});
    private addEventListenerMock = Mock.ofInstance((e, ev) => {});
    private featureFlags: DictionaryStringTo<boolean> = {};
    private deps: ContentLinkDeps = {} as ContentLinkDeps;
    private configurationStub: VisualizationConfiguration;

    constructor(visualizationType: VisualizationType, telemetrySource: TelemetryEventSource) {
        this.visualizationType = visualizationType;
        this.telemetrySource = telemetrySource;
    }

    public setupDeps(deps: ContentLinkDeps): DiagnosticViewTogglePropsBuilder {
        this.deps = deps;
        return this;
    }
    public setupShortcutCommands(
        shortcutCommands: chrome.commands.Command[],
    ): DiagnosticViewTogglePropsBuilder {
        this.shortcutCommands = shortcutCommands;
        return this;
    }

    public setupVisualizationStoreData(
        data: VisualizationStoreData,
    ): DiagnosticViewTogglePropsBuilder {
        this.data = data;
        return this;
    }

    public setupOpenDetailsViewCall(event): DiagnosticViewTogglePropsBuilder {
        this.actionMessageCreatorMock
            .setup(ac =>
                ac.openDetailsView(
                    event,
                    this.visualizationType,
                    this.telemetrySource,
                    DetailsViewPivotType.fastPass,
                ),
            )
            .verifiable(Times.once());

        return this;
    }

    public setupToggleVisualizationCall(event): DiagnosticViewTogglePropsBuilder {
        this.clickHandlerMock
            .setup(ch => ch.toggleVisualization(this.data, this.visualizationType, event))
            .verifiable(Times.once());

        return this;
    }

    public setupFeatureFlags(
        featureFlags: DictionaryStringTo<boolean>,
    ): DiagnosticViewTogglePropsBuilder {
        this.featureFlags = featureFlags;
        return this;
    }

    public build(): DiagnosticViewToggleProps {
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
            .returns(
                visualizationType =>
                    this.configurationStub ||
                    this.visualizationConfigurationFactory.getConfiguration(visualizationType),
            )
            .verifiable();

        const props: DiagnosticViewToggleProps = {
            deps: this.deps,
            featureFlags: this.featureFlags,
            dom: domMock as any,
            visualizationType: this.visualizationType,
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
