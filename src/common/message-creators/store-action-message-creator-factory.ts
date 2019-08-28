// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStoreStateMessage, Messages } from '../messages';
import { StoreNames } from '../stores/store-names';
import { ActionMessageDispatcher } from './action-message-dispatcher';
import { StoreActionMessageCreator } from './store-action-message-creator';
import { StoreActionMessageCreatorImpl } from './store-action-message-creator-impl';

export class StoreActionMessageCreatorFactory {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}

    public forPopup(): StoreActionMessageCreator {
        const getStateMessages: string[] = [
            getStoreStateMessage(StoreNames.VisualizationStore),
            Messages.Command.GetCommands,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.LaunchPanel.Get,
            Messages.UserConfig.GetCurrentState,
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public forDetailsView(): StoreActionMessageCreator {
        const getStateMessages: string[] = [
            Messages.Visualizations.DetailsView.GetState,
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            getStoreStateMessage(StoreNames.VisualizationStore),
            Messages.Tab.GetCurrent,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.Assessment.GetCurrentState,
            Messages.Scoping.GetCurrentState,
            Messages.UserConfig.GetCurrentState,
            Messages.PathSnippet.GetCurrentState,
            Messages.UnifiedScan.GetCurrentState,
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public forContent(): StoreActionMessageCreator {
        const getStateMessages: string[] = [Messages.UserConfig.GetCurrentState];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public forInjected(): StoreActionMessageCreator {
        const getStateMessages: string[] = [
            getStoreStateMessage(StoreNames.VisualizationStore),
            Messages.Scoping.GetCurrentState,
            Messages.Inspect.GetCurrentState,
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.DevTools.Get,
            Messages.Assessment.GetCurrentState,
            Messages.Tab.GetCurrent,
            Messages.UserConfig.GetCurrentState,
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }
}
