// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WindowUtils } from '../common/window-utils';
import { InspectMode } from '../background/inspect-modes';
import { autobind } from '@uifabric/utilities';

import { Messages } from '../common/messages';
import { ContentScriptInjector } from './injector/content-script-injector';
import { Interpreter } from './interpreter';
import { TabStore } from './stores/tab-store';
import { VisualizationStore } from './stores/visualization-store';
import { InspectStore } from './stores/inspect-store';

export class InjectorController {
    private _injector: ContentScriptInjector;
    private _visualizationStore: VisualizationStore;
    private _inspectStore: InspectStore;
    private _interpreter: Interpreter;
    private _tabStore: TabStore;
    private _windowUtils: WindowUtils;
    private static readonly injectionStartedWaitTime = 10;

    private _oldInspectType = InspectMode.off;

    constructor(
        injector: ContentScriptInjector,
        visualizationStore: VisualizationStore,
        interpreter: Interpreter,
        tabStore: TabStore,
        inspectStore: InspectStore,
        windowUtils?: WindowUtils,
    ) {
        this._injector = injector;
        this._visualizationStore = visualizationStore;
        this._tabStore = tabStore;
        this._inspectStore = inspectStore;
        this._interpreter = interpreter;
        this._windowUtils = windowUtils || new WindowUtils();
    }

    public initialize() {
        this._visualizationStore.addChangedListener(this.inject);
        this._inspectStore.addChangedListener(this.inject);
    }

    @autobind
    private inject() {
        const tabId: number = this._tabStore.getState().id;
        const visualizationStoreState = this._visualizationStore.getState();
        const inspectStoreState = this._inspectStore.getState();

        if (
            ((this._oldInspectType !== inspectStoreState.inspectMode && inspectStoreState.inspectMode !== InspectMode.off) ||
                visualizationStoreState.injectingInProgress === true) &&
            !visualizationStoreState.injectingStarted
        ) {
            this._windowUtils.setTimeout(() => {
                this._interpreter.interpret({
                    type: Messages.Visualizations.State.InjectionStarted,
                    tabId: tabId,
                });
            }, InjectorController.injectionStartedWaitTime);

            this._injector.injectScripts(tabId).then(() => {
                this._interpreter.interpret({
                    type: Messages.Visualizations.State.InjectionCompleted,
                    tabId: tabId,
                });
            });
        }

        this._oldInspectType = inspectStoreState.inspectMode;
    }
}
