// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../messages';
import { StoreActionMessageCreatorImpl } from './store-action-message-creator';

export class StoreActionMessageCreatorFactory {
    private postMessage: (message: Message) => void;
    private tabId: number;

    constructor(postMessage: (message: Message) => void, tabId: number) {
        this.postMessage = postMessage;
        this.tabId = tabId;
    }

    public forPopup(): StoreActionMessageCreatorImpl {
        const getStateMessages: string[] = [
            Messages.Visualizations.State.GetCurrentVisualizationToggleState,
            Messages.Command.GetCommands,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.LaunchPanel.Get,
            Messages.UserConfig.GetCurrentState,
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.postMessage, this.tabId);
    }

    public forDetailsView(): StoreActionMessageCreatorImpl {
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

        return new StoreActionMessageCreatorImpl(getStateMessage, this.postMessage, this.tabId);
    }

    public forContent(): StoreActionMessageCreatorImpl {
        const getStateMessage: string[] = [Messages.UserConfig.GetCurrentState];

        return new StoreActionMessageCreatorImpl(getStateMessage, this.postMessage, this.tabId);
    }

    public forInjected(): StoreActionMessageCreatorImpl {
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

        return new StoreActionMessageCreatorImpl(messages, this.postMessage, this.tabId);
    }
}
