// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';
import { Message } from '../../../../../common/message';
import { StoreActionMessageCreator } from '../../../../../common/message-creators/store-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../../../../../common/message-creators/store-action-message-creator-factory';
import { Messages } from '../../../../../common/messages';

describe('StoreActionMessageCreatorFactoryTest', () => {
    let postMessageMock: IMock<(_message: Message) => void>;
    const tabId: number = -1;

    beforeEach(() => {
        postMessageMock = Mock.ofInstance(_message => {}, MockBehavior.Strict);
    });

    test('forPopup', () => {
        const messages: string[] = [
            Messages.Visualizations.State.GetCurrentVisualizationToggleState,
            Messages.Command.GetCommands,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.LaunchPanel.Get,
            Messages.UserConfig.GetCurrentState,
        ];

        testWithExpectedMessages(messages, testObject => testObject.forPopup());
    });

    test('forDetailsView', () => {
        const message: string[] = [
            Messages.Visualizations.DetailsView.GetState,
            Messages.Visualizations.State.GetCurrentVisualizationResultState,
            Messages.Visualizations.State.GetCurrentVisualizationToggleState,
            Messages.Tab.GetCurrent,
            Messages.FeatureFlags.GetFeatureFlags,
            Messages.Assessment.GetCurrentState,
            Messages.Scoping.GetCurrentState,
            Messages.UserConfig.GetCurrentState,
        ];

        testWithExpectedMessages(message, testObject => testObject.forDetailsView());
    });

    test('forInjected', () => {
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

        testWithExpectedMessages(messages, testObject => testObject.forInjected());
    });

    test('forContent', () => {
        const messages: string[] = [Messages.UserConfig.GetCurrentState];

        testWithExpectedMessages(messages, testObject => testObject.forContent());
    });

    function testWithExpectedMessages(
        messages: string[],
        getter: (testObject: StoreActionMessageCreatorFactory) => StoreActionMessageCreator,
    ): void {
        messages.forEach(message => setupPostMessageMock(message));

        const testObject = new StoreActionMessageCreatorFactory(postMessageMock.object, tabId);

        const creator = getter(testObject);

        creator.getAllStates();

        postMessageMock.verifyAll();
    }

    function setupPostMessageMock(message: string): void {
        postMessageMock.setup(pm =>
            pm(
                It.isValue({
                    type: message,
                    tabId: tabId,
                }),
            ),
        );
    }
});
