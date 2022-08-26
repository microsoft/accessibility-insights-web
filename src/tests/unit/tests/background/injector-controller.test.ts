// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InjectorController } from 'background/injector-controller';
import { ContentScriptInjector } from 'background/injector/content-script-injector';
import { Interpreter } from 'background/interpreter';
import { InspectStore } from 'background/stores/inspect-store';
import { TabStore } from 'background/stores/tab-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { Messages } from 'common/messages';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { VisualizationStoreDataBuilder } from 'tests/unit/common/visualization-store-data-builder';
import { It, Mock, MockBehavior, Times } from 'typemoq';

describe('InjectorControllerTest', () => {
    let validator: InjectorControllerValidator;
    const tabId = 1;

    beforeEach(() => {
        validator = new InjectorControllerValidator();
    });

    test('initialize: injectingRequested is true = inject occurs', async () => {
        const visualizationData = new VisualizationStoreDataBuilder()
            .with('injectingRequested', true)
            .build();

        validator
            .setupTabStore({ id: tabId })
            .setupVizStoreGetState(visualizationData)
            .setupInspectStore({ inspectMode: InspectMode.off })
            .setupInjectScriptsCall(tabId, 1);

        validator.buildInjectorController().initialize();
        validator.setupVerifyInjectionStartedActionCalled(tabId);
        validator.setupVerifyInjectionCompletedActionCalled(tabId);
        await validator.visualizationInjectCallback();
        validator.verifyAll();
    });

    test('inject occurs when inspect mode changes', async () => {
        const visualizationData = new VisualizationStoreDataBuilder().build();

        validator
            .setupTabStore({ id: tabId })
            .setupVizStoreGetState(visualizationData)
            .setupInspectStore({ inspectMode: InspectMode.scopingAddInclude })
            .setupInjectScriptsCall(tabId, 1);

        validator.buildInjectorController().initialize();
        validator.setupVerifyInjectionStartedActionCalled(tabId);
        validator.setupVerifyInjectionCompletedActionCalled(tabId);
        await validator.inspectInjectCallback();
        validator.verifyAll();
    });

    test("inject doesn't occur when inspect mode is unchanged", async () => {
        const visualizationData = new VisualizationStoreDataBuilder()
            .with('injectingRequested', false)
            .build();

        // Inject once to setup internal state.
        validator
            .setupTabStore({ id: tabId })
            .setupVizStoreGetState(visualizationData)
            .setupInspectStore({ inspectMode: InspectMode.scopingAddExclude })
            .setupVerifyInjectionCompletedActionCalled(tabId)
            .setupInjectScriptsCall(tabId, 1)
            .setupVerifyInjectionStartedActionCalled(tabId);
        validator.buildInjectorController().initialize();
        await validator.inspectInjectCallback();
        validator.verifyAll();
        validator.resetVerify();

        validator
            .setupTabStore({ id: tabId })
            .setupVizStoreGetState(visualizationData)
            .setupInspectStore({ inspectMode: InspectMode.scopingAddExclude })
            .setupInjectScriptsCall(tabId, 0);
        await validator.inspectInjectCallback();
        validator.verifyAll();
    });

    test('initialize: already injecting => no inject', async () => {
        const visualizationData = new VisualizationStoreDataBuilder()
            .with('injectingRequested', true)
            .with('injectingStarted', true)
            .build();

        validator
            .setupTabStore({ id: 1 })
            .setupInspectStore({ inspectMode: InspectMode.off })
            .setupVizStoreGetState(visualizationData);

        validator.buildInjectorController().initialize();
        await validator.inspectInjectCallback();
        validator.verifyAll();
    });

    test('initialize: injectingRequested is false and inspect mode is off => no inject', async () => {
        const visualizationData = new VisualizationStoreDataBuilder()
            .with('injectingRequested', false)
            .build();

        validator
            .setupTabStore({ id: 1 })
            .setupInspectStore({ inspectMode: InspectMode.off })
            .setupVizStoreGetState(visualizationData);

        validator.buildInjectorController().initialize();
        await validator.inspectInjectCallback();
        validator.verifyAll();
    });
});

class InjectorControllerValidator {
    private mockInjector = Mock.ofType(ContentScriptInjector, MockBehavior.Strict);
    private mockVisualizationStore = Mock.ofType(VisualizationStore, MockBehavior.Strict);
    private mockInterpreter = Mock.ofType(Interpreter, MockBehavior.Strict);
    private mockInspectStore = Mock.ofType(InspectStore, MockBehavior.Strict);
    private mockTabStore = Mock.ofType(TabStore, MockBehavior.Strict);
    public visualizationInjectCallback: () => Promise<void>;
    public inspectInjectCallback: () => Promise<void>;

    public buildInjectorController(): InjectorController {
        this.mockVisualizationStore
            .setup(mockVizStore =>
                mockVizStore.addChangedListener(
                    It.is(param => {
                        return typeof param === 'function';
                    }),
                ),
            )
            .callback(inject => {
                this.visualizationInjectCallback = inject;
            })
            .verifiable();

        this.mockInspectStore
            .setup(inspectStore =>
                inspectStore.addChangedListener(
                    It.is(param => {
                        return typeof param === 'function';
                    }),
                ),
            )
            .callback(inject => {
                this.inspectInjectCallback = inject;
            })
            .verifiable();

        return new InjectorController(
            this.mockInjector.object,
            this.mockVisualizationStore.object,
            this.mockInterpreter.object,
            this.mockTabStore.object,
            this.mockInspectStore.object,
            failTestOnErrorLogger,
        );
    }

    public setupVerifyInjectionStartedActionCalled(
        tabId: number,
        numTimes: number = 1,
    ): InjectorControllerValidator {
        this.mockInterpreter
            .setup(x =>
                x.interpret(
                    It.isObjectWith({
                        messageType: Messages.Visualizations.State.InjectionStarted,
                        tabId: tabId,
                    }),
                ),
            )
            .returns(() => ({ messageHandled: true, result: undefined }))
            .verifiable(Times.exactly(numTimes));

        return this;
    }

    public setupVerifyInjectionCompletedActionCalled(
        tabId: number,
        numTimes: number = 1,
    ): InjectorControllerValidator {
        this.mockInterpreter
            .setup(x =>
                x.interpret(
                    It.isObjectWith({
                        messageType: Messages.Visualizations.State.InjectionCompleted,
                        tabId: tabId,
                    }),
                ),
            )
            .returns(() => ({ messageHandled: true, result: undefined }))
            .verifiable(Times.exactly(numTimes));

        return this;
    }

    public setupInspectStore(returnState): InjectorControllerValidator {
        this.mockInspectStore
            .setup(inspectStore => inspectStore.getState())
            .returns(() => {
                return returnState;
            })
            .verifiable(Times.atLeastOnce());

        return this;
    }

    public setupTabStore(returnState): InjectorControllerValidator {
        this.mockTabStore
            .setup(tabStore => tabStore.getState())
            .returns(() => {
                return returnState;
            })
            .verifiable(Times.atLeastOnce());

        return this;
    }

    public setupVizStoreGetState(returnState: VisualizationStoreData): InjectorControllerValidator {
        this.mockVisualizationStore
            .setup(mockVisualizationStore => mockVisualizationStore.getState())
            .returns(() => {
                return returnState;
            })
            .verifiable(Times.atLeastOnce());

        return this;
    }

    public setupInjectScriptsCall(
        calledWithTabId: number,
        numTimes: number,
    ): InjectorControllerValidator {
        this.mockInjector
            .setup(injector => injector.injectScripts(calledWithTabId))
            .returns(() => Promise.resolve())
            .verifiable(Times.exactly(numTimes));

        return this;
    }

    public verifyAll(): void {
        this.mockVisualizationStore.verifyAll();
        this.mockInspectStore.verifyAll();
        this.mockTabStore.verifyAll();
        this.mockInjector.verifyAll();
        this.mockInterpreter.verifyAll();
    }

    public resetVerify(): void {
        this.mockVisualizationStore.reset();
        this.mockInspectStore.reset();
        this.mockTabStore.reset();
        this.mockInjector.reset();
        this.mockInterpreter.reset();
    }
}
