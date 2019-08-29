// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';
import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { StoreActionMessageCreator } from '../../../../../common/message-creators/store-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../../../../../common/message-creators/store-action-message-creator-factory';
import { getStoreStateMessage, Messages } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';

describe('StoreActionMessageCreatorFactoryTest', () => {
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>(undefined, MockBehavior.Strict);

    beforeEach(() => {
        dispatcherMock.reset();
    });

    it('dispatches message types for forPopup', () => {
        const messages: string[] = [
            getStoreStateMessage(StoreNames.VisualizationStore),
            getStoreStateMessage(StoreNames.CommandStore),
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            getStoreStateMessage(StoreNames.LaunchPanelStateStore),
            getStoreStateMessage(StoreNames.UserConfigurationStore),
        ];

        testWithExpectedMessages(messages, testObject => testObject.forPopup());
    });

    it('dispatches message types for forDetailsView', () => {
        const messages: string[] = [
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

        testWithExpectedMessages(messages, testObject => testObject.forDetailsView());
    });

    it('dispatches message types for forInjected', () => {
        const messages: string[] = [
            getStoreStateMessage(StoreNames.VisualizationStore),
            getStoreStateMessage(StoreNames.ScopingPanelStateStore),
            Messages.Inspect.GetCurrentState,
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            Messages.DevTools.Get,
            getStoreStateMessage(StoreNames.AssessmentStore),
            getStoreStateMessage(StoreNames.TabStore),
            getStoreStateMessage(StoreNames.UserConfigurationStore),
        ];

        testWithExpectedMessages(messages, testObject => testObject.forInjected());
    });

    it('dispatches message types for forContent', () => {
        const messages: string[] = [getStoreStateMessage(StoreNames.UserConfigurationStore)];

        testWithExpectedMessages(messages, testObject => testObject.forContent());
    });

    function testWithExpectedMessages(
        messages: string[],
        getter: (testObject: StoreActionMessageCreatorFactory) => StoreActionMessageCreator,
    ): void {
        messages.forEach(message => setupDispatcherMock(message));

        const testObject = new StoreActionMessageCreatorFactory(dispatcherMock.object);

        const creator = getter(testObject);

        creator.getAllStates();

        dispatcherMock.verifyAll();
    }

    function setupDispatcherMock(messageType: string): void {
        dispatcherMock.setup(dispatcher => dispatcher.dispatchType(messageType));
    }
});
