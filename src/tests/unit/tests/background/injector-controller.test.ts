// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InjectorController } from 'background/injector-controller';
import { ContentScriptInjector } from 'background/injector/content-script-injector';
import { Interpreter } from 'background/interpreter';
import { InspectStore } from 'background/stores/inspect-store';
import { TabStore } from 'background/stores/tab-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { Logger } from 'common/logging/logger';
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
        await validator.visualizationInjectCallback();
        validator.setupVerifyInjectionCompletedActionCalled(tabId);
        await validator.invokeInjectedPromise();
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
        await validator.inspectInjectCallback();
        validator.setupVerifyInjectionCompletedActionCalled(tabId);
        await validator.invokeInjectedPromise();
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
        await validator.invokeInjectedPromise();
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

    test("inject doesn't occur when injection has failed", async () => {
        const visualizationData = new VisualizationStoreDataBuilder()
            .with('injectionFailed', true)
            .build();

        validator
            .setupTabStore({ id: tabId })
            .setupVizStoreGetState(visualizationData)
            .setupInspectStore({ inspectMode: InspectMode.off })
            .setupInjectScriptsCall(tabId, 0);
        validator.buildInjectorController().initialize();
        await validator.inspectInjectCallback();
        validator.verifyAll();
    });

    test('inject sends injection failed message when injection errors', async () => {
        const visualizationData = new VisualizationStoreDataBuilder()
            .with('injectingRequested', true)
            .build();

        validator
            .setupTabStore({ id: tabId })
            .setupVizStoreGetState(visualizationData)
            .setupInspectStore({ inspectMode: InspectMode.off })
            .setupFailingInjectScriptsCall(tabId)
            .setupLoggerError(undefined);

        validator.buildInjectorController(false).initialize();
        validator.setupVerifyInjectionStartedActionCalled(tabId, 1);
        validator.setupVerifyInjectionFailedActionCalled(tabId);
        await validator.inspectInjectCallback();
        await validator.invokeRejectedPromise();
        validator.verifyAll();
    });
});

class InjectorControllerValidator {
    private mockInjector = Mock.ofType(ContentScriptInjector, MockBehavior.Strict);
    private mockVisualizationStore = Mock.ofType(VisualizationStore, MockBehavior.Strict);
    private mockInterpreter = Mock.ofType(Interpreter, MockBehavior.Strict);
    private mockInspectStore = Mock.ofType(InspectStore, MockBehavior.Strict);
    private mockTabStore = Mock.ofType(TabStore, MockBehavior.Strict);
    private mockLogger = Mock.ofType<Logger>();
    private injectedScriptsDeferred: Promise<void>;
    private injectedScriptsDeferredResolver: () => void;
    private injectedScriptsDeferredRejector: () => void;
    public visualizationInjectCallback: () => Promise<void>;
    public inspectInjectCallback: () => Promise<void>;

    public buildInjectorController(failOnLoggerError = true): InjectorController {
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
            failOnLoggerError ? failTestOnErrorLogger : this.mockLogger.object,
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

    public setupVerifyInjectionFailedActionCalled(
        numTimes: number = 1,
    ): InjectorControllerValidator {
        this.mockInterpreter
            .setup(x =>
                x.interpret(
                    It.isObjectWith({
                        messageType: Messages.Visualizations.State.InjectionFailed,
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
        this.injectedScriptsDeferred = new Promise(resolve => {
            this.injectedScriptsDeferredResolver = resolve;
        });
        this.mockInjector
            .setup(injector => injector.injectScripts(calledWithTabId))
            .returns(() => this.injectedScriptsDeferred)
            .verifiable(Times.exactly(numTimes));

        return this;
    }

    public setupFailingInjectScriptsCall(calledWithTabId: number): InjectorControllerValidator {
        this.injectedScriptsDeferred = new Promise((resolve, reject) => {
            this.injectedScriptsDeferredRejector = reject;
        });
        this.mockInjector
            .setup(injector => injector.injectScripts(calledWithTabId))
            .returns(() => this.injectedScriptsDeferred)
            .verifiable(Times.once());

        return this;
    }

    public setupLoggerError(errorMsg: any): InjectorControllerValidator {
        this.mockLogger.setup(mockLogger => mockLogger.error(errorMsg)).verifiable(Times.once());

        return this;
    }

    public async invokeInjectedPromise(): Promise<void> {
        this.injectedScriptsDeferredResolver();
        return await this.injectedScriptsDeferred;
    }

    public async invokeRejectedPromise(): Promise<void> {
        this.injectedScriptsDeferredRejector();
        return await expect(this.injectedScriptsDeferred).rejects.toBe(undefined);
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
