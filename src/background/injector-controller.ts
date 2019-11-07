// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectMode } from 'background/inspect-modes';
import { Messages } from '../common/messages';
import { WindowUtils } from '../common/window-utils';
import { ContentScriptInjector } from './injector/content-script-injector';
import { Interpreter } from './interpreter';
import { InspectStore } from './stores/inspect-store';
import { TabStore } from './stores/tab-store';
import { VisualizationStore } from './stores/visualization-store';

export class InjectorController {
    private injector: ContentScriptInjector;
    private visualizationStore: VisualizationStore;
    private inspectStore: InspectStore;
    private interpreter: Interpreter;
    private tabStore: TabStore;
    private windowUtils: WindowUtils;
    private static readonly injectionStartedWaitTime = 10;

    private oldInspectType = InspectMode.off;

    constructor(
        injector: ContentScriptInjector,
        visualizationStore: VisualizationStore,
        interpreter: Interpreter,
        tabStore: TabStore,
        inspectStore: InspectStore,
        windowUtils?: WindowUtils,
    ) {
        this.injector = injector;
        this.visualizationStore = visualizationStore;
        this.tabStore = tabStore;
        this.inspectStore = inspectStore;
        this.interpreter = interpreter;
        this.windowUtils = windowUtils || new WindowUtils();
    }

    public initialize(): void {
        this.visualizationStore.addChangedListener(this.inject);
        this.inspectStore.addChangedListener(this.inject);
    }

    private inject = (): void => {
        const tabId: number = this.tabStore.getState().id;
        const visualizationStoreState = this.visualizationStore.getState();
        const inspectStoreState = this.inspectStore.getState();

        if (
            ((this.oldInspectType !== inspectStoreState.inspectMode && inspectStoreState.inspectMode !== InspectMode.off) ||
                visualizationStoreState.injectingInProgress === true) &&
            !visualizationStoreState.injectingStarted
        ) {
            this.windowUtils.setTimeout(() => {
                this.interpreter.interpret({
                    messageType: Messages.Visualizations.State.InjectionStarted,
                    tabId: tabId,
                });
            }, InjectorController.injectionStartedWaitTime);

            // tslint:disable-next-line:no-floating-promises - grandfathered
            this.injector.injectScriptsP(tabId).then(() => {
                this.interpreter.interpret({
                    messageType: Messages.Visualizations.State.InjectionCompleted,
                    tabId: tabId,
                });
            });
        }

        this.oldInspectType = inspectStoreState.inspectMode;
    };
}
