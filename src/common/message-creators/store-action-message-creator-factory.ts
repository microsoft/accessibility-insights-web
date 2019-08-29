// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../base-store';
import { getStoreStateMessage } from '../messages';
import { StoreNames } from '../stores/store-names';
import { ActionMessageDispatcher } from './action-message-dispatcher';
import { StoreActionMessageCreator } from './store-action-message-creator';
import { StoreActionMessageCreatorImpl } from './store-action-message-creator-impl';

export class StoreActionMessageCreatorFactory {
    constructor(private readonly dispatcher: ActionMessageDispatcher) {}

    public forPopup(): StoreActionMessageCreator {
        const getStateMessages: string[] = [
            getStoreStateMessage(StoreNames.VisualizationStore),
            getStoreStateMessage(StoreNames.CommandStore),
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            getStoreStateMessage(StoreNames.LaunchPanelStateStore),
            getStoreStateMessage(StoreNames.UserConfigurationStore),
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public forDetailsView(): StoreActionMessageCreator {
        const getStateMessages: string[] = [
            getStoreStateMessage(StoreNames.DetailsViewStore),
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            getStoreStateMessage(StoreNames.VisualizationStore),
            getStoreStateMessage(StoreNames.TabStore),
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            getStoreStateMessage(StoreNames.AssessmentStore),
            getStoreStateMessage(StoreNames.ScopingPanelStateStore),
            getStoreStateMessage(StoreNames.UserConfigurationStore),
            getStoreStateMessage(StoreNames.PathSnippetStore),
            getStoreStateMessage(StoreNames.UnifiedScanResultStore),
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public forContent(): StoreActionMessageCreator {
        const getStateMessages: string[] = [getStoreStateMessage(StoreNames.UserConfigurationStore)];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public forInjected(): StoreActionMessageCreator {
        const getStateMessages: string[] = [
            getStoreStateMessage(StoreNames.VisualizationStore),
            getStoreStateMessage(StoreNames.ScopingPanelStateStore),
            getStoreStateMessage(StoreNames.InspectStore),
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            getStoreStateMessage(StoreNames.DevToolsStore),
            getStoreStateMessage(StoreNames.AssessmentStore),
            getStoreStateMessage(StoreNames.TabStore),
            getStoreStateMessage(StoreNames.UserConfigurationStore),
        ];

        return new StoreActionMessageCreatorImpl(getStateMessages, this.dispatcher);
    }

    public fromStores(stores: BaseStore<any>[]): StoreActionMessageCreator {
        const messages = stores.map(store => getStoreStateMessage(StoreNames[store.getId()]));

        return new StoreActionMessageCreatorImpl(messages, this.dispatcher);
    }
}
