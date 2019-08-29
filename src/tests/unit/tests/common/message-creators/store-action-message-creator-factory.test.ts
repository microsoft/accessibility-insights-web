// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';

import { BaseStore } from '../../../../../common/base-store';
import { EnumHelper } from '../../../../../common/enum-helper';
import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { StoreActionMessageCreator } from '../../../../../common/message-creators/store-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../../../../../common/message-creators/store-action-message-creator-factory';
import { getStoreStateMessage } from '../../../../../common/messages';
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
            getStoreStateMessage(StoreNames.InspectStore),
            getStoreStateMessage(StoreNames.VisualizationScanResultStore),
            getStoreStateMessage(StoreNames.FeatureFlagStore),
            getStoreStateMessage(StoreNames.DevToolsStore),
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

    it('dispatches messages for fromStores', () => {
        const createStoreMock = (storeName: StoreNames) => {
            const mock = Mock.ofType<BaseStore<any>>(undefined, MockBehavior.Strict);
            mock.setup(store => store.getId()).returns(() => StoreNames[storeName]);
            return mock;
        };

        const storeNames = EnumHelper.getNumericValues<StoreNames>(StoreNames);

        const storeMocks = storeNames.map(createStoreMock).map(mock => mock.object);

        const expectedMessages = storeNames.map(name => getStoreStateMessage(name));

        testWithExpectedMessages(expectedMessages, testObject => testObject.fromStores(storeMocks));
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
