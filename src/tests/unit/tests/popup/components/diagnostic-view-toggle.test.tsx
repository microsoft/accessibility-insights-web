// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link, Spinner } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { Assessments } from 'assessments/assessments';
import { assessmentsProviderForRequirements } from 'assessments/assessments-requirements-filter';
import { QuickAssessRequirementMap } from 'assessments/quick-assess-requirements';
import { VisualizationToggle } from 'common/components/visualization-toggle';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import {
    DiagnosticViewToggle,
    DiagnosticViewToggleProps,
} from 'popup/components/diagnostic-view-toggle';
import { DiagnosticViewClickHandler } from 'popup/handlers/diagnostic-view-toggle-click-handler';
import * as React from 'react';
import '@testing-library/jest-dom';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentProvider } from 'views/content/content-page';
import { EventStubFactory } from '../../../common/event-stub-factory';
import { ShortcutCommandsTestData } from '../../../common/sample-test-data';
import { VisualizationStoreDataBuilder } from '../../../common/visualization-store-data-builder';

jest.mock('views/content/content-link');
jest.mock('common/components/visualization-toggle');
jest.mock('@fluentui/react');
jest.mock('react', () => {
    const original = jest.requireActual('react');
    return {
        ...original,
        createRef: jest.fn().mockReturnValue({ current: { focus: jest.fn() } }),
    };
});

describe('DiagnosticViewToggleTest', () => {
    mockReactComponents([ContentLink, VisualizationToggle, Spinner, Link]);
    const visualizationConfigurationFactory = new WebVisualizationConfigurationFactory(
        Assessments,
        assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
    );
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

            const wrapper = render(<DiagnosticViewToggle {...props} />);

            expect(wrapper.asFragment()).toMatchSnapshot();
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

            const wrapper = render(<DiagnosticViewToggle {...props} />);
            expect(wrapper.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([VisualizationToggle]);
        });

        it('toggle when not scanning', () => {
            const visualizationType = VisualizationType.Headings;

            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).build();

            const wrapper = render(<DiagnosticViewToggle {...props} />);

            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it('details view link when the test does not have a guidance', () => {
            const visualizationType = VisualizationType.Issues;

            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).build();

            const wrapper = render(<DiagnosticViewToggle {...props} />);

            expect(wrapper.asFragment()).toMatchSnapshot();
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

            render(<DiagnosticViewToggle {...props} />);
            getMockComponentClassPropsForCall(Link).onClick(event);

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

            render(<DiagnosticViewToggle {...props} />);

            getMockComponentClassPropsForCall(VisualizationToggle).onClick(event);

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

            render(<DiagnosticViewToggle {...props} />);

            getMockComponentClassPropsForCall(Link).onClick(event);

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

            render(<DiagnosticViewToggle {...props} />);
            getMockComponentClassPropsForCall(Link).onClick(event);

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
    });

    describe('life cycle events', () => {
        it('sets focus when componentDidMount', async () => {
            useOriginalReactElements('common/components/visualization-toggle', [
                'VisualizationToggle',
            ]);
            useOriginalReactElements('@fluentui/react', ['Toggle']);
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

            const component = React.createElement(TestDiagnosticViewToggle, props);

            const wrapper = render(component);
            const toggle = wrapper.getByRole('switch');
            fireEvent.focus(toggle);

            wrapper.rerender(component);
            expect(toggle).toHaveFocus();
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

            const wrapper = render(<DiagnosticViewToggle {...props} />);

            const toggle = wrapper.getByRole('switch');
            toggle.focus = jest.fn();
            fireEvent.focus(toggle);
            expect(toggle.focus).toHaveBeenCalledTimes(1);

            wrapper.rerender(
                <DiagnosticViewToggle {...props} visualizationType={VisualizationType.Headings} />,
            );
            expect(toggle.focus).toHaveBeenCalledTimes(2);
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

            const wrapper = render(component);

            const toggle = wrapper.getByRole('switch');
            expect(toggle).not.toHaveFocus();

            fireEvent.focus(toggle);

            expect(toggle).toHaveFocus();
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

            const wrapper = render(component);

            const toggle = wrapper.getByRole('switch');

            expect(toggle).not.toHaveFocus();
        });

        it('onBlurToggleHandler', () => {
            const visualizationType = VisualizationType.Headings;
            const props: DiagnosticViewToggleProps = new DiagnosticViewTogglePropsBuilder(
                visualizationType,
                testTelemetrySource,
            ).build();

            const wrapper = render(<DiagnosticViewToggle {...props} />);

            const toggle = wrapper.getByRole('switch');
            fireEvent.blur(toggle);
            expect(toggle).not.toHaveFocus();
        });
    });

    it('addUserEventListener', () => {
        const visualizationType = VisualizationType.Headings;
        const data = new VisualizationStoreDataBuilder().with('scanning', 'headings').build();
        const event = eventStubFactory.createKeypressEvent();
        const depsMock = createDepsMock();

        const propsBuilder = new DiagnosticViewTogglePropsBuilder(
            visualizationType,
            testTelemetrySource,
        )
            .setupVisualizationStoreData(data)
            .setupOpenDetailsViewCall(event)
            .setupDeps(depsMock.object);

        const props: DiagnosticViewToggleProps = propsBuilder.build();

        render(<DiagnosticViewToggle {...props} />);

        const eventListener = getMockComponentClassPropsForCall(Spinner).componentRef;
        eventListener();
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
    private visualizationConfigurationFactory = new WebVisualizationConfigurationFactory(
        Assessments,
        assessmentsProviderForRequirements(Assessments, QuickAssessRequirementMap),
    );
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
class TestDiagnosticViewToggle extends DiagnosticViewToggle {
    public componentDidMount(): void {
        this._isMounted = false;
        this.setState({ isFocused: true });
        super.componentDidMount();
    }
}
