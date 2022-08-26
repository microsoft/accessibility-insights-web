// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { Messages } from '../common/messages';
import { ContentScriptInjector } from './injector/content-script-injector';
import { Interpreter } from './interpreter';
import { InspectStore } from './stores/inspect-store';
import { TabStore } from './stores/tab-store';
import { VisualizationStore } from './stores/visualization-store';

export class InjectorController {
    private oldInspectType = InspectMode.off;

    constructor(
        private readonly injector: ContentScriptInjector,
        private readonly visualizationStore: VisualizationStore,
        private readonly interpreter: Interpreter,
        private readonly tabStore: TabStore,
        private readonly inspectStore: InspectStore,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.visualizationStore.addChangedListener(this.inject);
        this.inspectStore.addChangedListener(this.inject);
    }

    private inject = async (): Promise<void> => {
        const tabId: number = this.tabStore.getState().id;
        const inspectStoreState = this.inspectStore.getState();
        const visualizationStoreState = this.visualizationStore.getState();

        const inspectStoreInjectingRequested =
            this.oldInspectType !== inspectStoreState.inspectMode &&
            inspectStoreState.inspectMode !== InspectMode.off;

        const isInjectingRequested =
            inspectStoreInjectingRequested || visualizationStoreState.injectingRequested;

        if (isInjectingRequested && !visualizationStoreState.injectingStarted) {
            await this.interpreter.interpret({
                messageType: Messages.Visualizations.State.InjectionStarted,
                tabId: tabId,
            }).result;

            try {
                await this.injector.injectScripts(tabId);
                await this.interpreter.interpret({
                    messageType: Messages.Visualizations.State.InjectionCompleted,
                    tabId: tabId,
                }).result;
            } catch (e) {
                this.logger.error(e);
            }
        }

        this.oldInspectType = inspectStoreState.inspectMode;
    };
}
