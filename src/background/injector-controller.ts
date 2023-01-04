// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionFailedPayload } from 'background/actions/action-payloads';
import { Logger } from 'common/logging/logger';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { InjectingState } from 'common/types/store-data/visualization-store-data';
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
            inspectStoreInjectingRequested ||
            visualizationStoreState.injectingState === InjectingState.injectingRequested;

        if (
            isInjectingRequested &&
            visualizationStoreState.injectingState !== InjectingState.injectingStarted &&
            visualizationStoreState.injectingState !== InjectingState.injectingFailed
        ) {
            await this.interpreter.interpret({
                messageType: Messages.Visualizations.State.InjectionStarted,
                tabId: tabId,
            }).result;

            this.injector
                .injectScripts(tabId)
                .then(async () => {
                    await this.interpreter.interpret({
                        messageType: Messages.Visualizations.State.InjectionCompleted,
                        tabId: tabId,
                    }).result;
                })
                .catch(this.handleInjectionError);
        }

        this.oldInspectType = inspectStoreState.inspectMode;
    };

    private handleInjectionError = async (err: any): Promise<void> => {
        this.logger.error(err);
        const attempts = (this.visualizationStore.getState().injectionAttempts ?? 0) + 1;
        const payload: InjectionFailedPayload = {
            failedAttempts: attempts,
            shouldRetry: attempts <= 3,
        };
        await this.interpreter.interpret({
            messageType: Messages.Visualizations.State.InjectionFailed,
            payload,
        }).result;
    };
}
