// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../messages';
import { IStoreActionMessageCreator } from './istore-action-message-creator';
import { StoreActionMessageCreator } from './store-action-message-creator';

export class StoreActionMessageCreatorFactory {
    private postMessage: (message: IMessage) => void;
    private tabId: number;

    constructor(postMessage: (message: IMessage) => void, tabId: number) {
        this.postMessage = postMessage;
        this.tabId = tabId;
    }

    public forPopup(): IStoreActionMessageCreator {
        const getStateMessages: string[] = [
            Messages.Visualizations.State.GetCurrentVisualizationToggleState,
            Messages.Command.GetCommands,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.LaunchPanel.Get,
            Messages.UserConfig.GetCurrentState,
        ];

        return new StoreActionMessageCreator(getStateMessages, this.postMessage, this.tabId);
    }

    public forDetailsView(): IStoreActionMessageCreator {
        const getStateMessage: string[] = [
            Messages.Visualizations.DetailsView.GetState,
            Messages.Visualizations.State.GetCurrentVisualizationResultState,
            Messages.Visualizations.State.GetCurrentVisualizationToggleState,
            Messages.Tab.GetCurrent,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.Assessment.GetCurrentState,
            Messages.Scoping.GetCurrentState,
            Messages.UserConfig.GetCurrentState,
        ];

        return new StoreActionMessageCreator(getStateMessage, this.postMessage, this.tabId);
    }

    public forInjected(): IStoreActionMessageCreator {
        const messages: string[] = [
            Messages.Visualizations.State.GetCurrentVisualizationToggleState,
            Messages.Scoping.GetCurrentState,
            Messages.Inspect.GetCurrentState,
            Messages.Visualizations.State.GetCurrentVisualizationResultState,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.DevTools.Get,
            Messages.Assessment.GetCurrentState,
            Messages.Tab.GetCurrent,
        ];

        return new StoreActionMessageCreator(messages, this.postMessage, this.tabId);
    }
}
