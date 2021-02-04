// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CommandActions, GetCommandsPayload } from 'background/actions/command-actions';
import { CommandStore } from 'background/stores/global/command-store';
import { TelemetryEventHandler } from 'background/telemetry/telemetry-event-handler';
import { IMock, It, Mock, Times } from 'typemoq';
import {
    ModifiedCommandsTelemetryData,
    SHORTCUT_MODIFIED,
} from '../../../../../../common/extension-telemetry-events';
import { StoreNames } from '../../../../../../common/stores/store-names';
import { CommandStoreData } from '../../../../../../common/types/store-data/command-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('CommandStoreTest', () => {
    let telemetryEventHandlerMock: IMock<TelemetryEventHandler>;

    beforeEach(() => {
        telemetryEventHandlerMock = Mock.ofType(TelemetryEventHandler);
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(CommandStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(CommandStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.CommandStore]);
    });

    test('on getCommands: no command modification', () => {
        const prototype = new CommandStore(null, null);
        const initialState: CommandStoreData = prototype.getDefaultState();
        const expectedState: CommandStoreData = prototype.getDefaultState();

        const payload: GetCommandsPayload = {
            commands: [],
            tabId: 1,
        };

        createStoreTesterForCommandActions('getCommands')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onGetCommands: modifying commands', () => {
        const initialCommand: chrome.commands.Command = {
            description: 'Toggle Headings',
            name: 'toggle-headings',
            shortcut: 'Ctrl+Shift+F',
        };

        const initialState: CommandStoreData = {
            commands: [initialCommand],
        };

        const newCommand: chrome.commands.Command = {
            description: initialCommand.description,
            name: initialCommand.name,
            shortcut: 'Ctrl+Shift+A',
        };

        const expectedState: CommandStoreData = {
            commands: [newCommand],
        };

        const tabId = 1;
        const payload: GetCommandsPayload = {
            commands: [newCommand],
            tabId: tabId,
        };

        const telemetry: ModifiedCommandsTelemetryData = {
            modifiedCommands: JSON.stringify(expectedState.commands),
        };

        const telemetryPayload = { telemetry };

        telemetryEventHandlerMock
            .setup(tp => tp.publishTelemetry(SHORTCUT_MODIFIED, It.isValue(telemetryPayload)))
            .verifiable(Times.once());

        createStoreTesterForCommandActions('getCommands')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);

        telemetryEventHandlerMock.verifyAll();
    });

    test("handling weird case: amount of commands change on runtime (this should not happen but we're handling it anyway)", () => {
        const initialState: CommandStoreData = new CommandStore(null, null).getDefaultState();

        const command: chrome.commands.Command = {
            description: 'Toggle Headings',
            name: 'toggle-headings',
            shortcut: 'Ctrl+Shift+F',
        };

        const newCommand: chrome.commands.Command = {
            description: command.description,
            name: command.name,
            shortcut: 'Ctrl+Shift+A',
        };

        const expectedState: CommandStoreData = {
            commands: [newCommand],
        };

        const tabId = 1;
        const payload: GetCommandsPayload = {
            commands: [newCommand],
            tabId: tabId,
        };

        createStoreTesterForCommandActions('getCommands')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForCommandActions(
        actionName: keyof CommandActions,
    ): StoreTester<CommandStoreData, CommandActions> {
        const factory = (actions: CommandActions) =>
            new CommandStore(actions, telemetryEventHandlerMock.object);

        return new StoreTester(CommandActions, actionName, factory);
    }
});
