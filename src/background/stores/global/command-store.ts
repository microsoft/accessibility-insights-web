// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { StoreNames } from '../../../common/stores/store-names';
import { ModifiedCommandsTelemetryData, SHORTCUT_MODIFIED } from '../../../common/telemetry-events';
import { ICommandStoreData } from '../../../common/types/store-data/icommand-store-data';
import { CommandActions, IGetCommandsPayload } from '../../actions/command-actions';
import { TelemetryEventHandler } from '../../telemetry/telemetry-event-handler';
import { BaseStore } from '../base-store';

export class CommandStore extends BaseStore<ICommandStoreData> {
    private commandActions: CommandActions;
    private telemetryEventHandler: TelemetryEventHandler;

    constructor(commandActions: CommandActions, telemetryEventHandler: TelemetryEventHandler) {
        super(StoreNames.CommandStore);

        this.commandActions = commandActions;
        this.telemetryEventHandler = telemetryEventHandler;
    }

    public getDefaultState(): ICommandStoreData {
        const defaultValues: ICommandStoreData = {
            commands: [],
        };

        return defaultValues;
    }

    protected addActionListeners(): void {
        this.commandActions.getCommands.addListener(this.onGetCommands);
    }

    @autobind
    private onGetCommands(payload: IGetCommandsPayload): void {
        const modifiedCommands: chrome.commands.Command[] = this.getModifiedCommands(payload.commands);
        if (modifiedCommands.length > 0) {
            const telemetry: ModifiedCommandsTelemetryData = {
                modifiedCommands: JSON.stringify(modifiedCommands),
            };

            const telemetryPayload = { telemetry };

            this.telemetryEventHandler.publishTelemetry(SHORTCUT_MODIFIED, telemetryPayload, payload.tabId);
        }

        this.state.commands = payload.commands;
        this.emitChanged();
    }

    private getModifiedCommands(currentCommands: chrome.commands.Command[]): chrome.commands.Command[] {
        if (currentCommands.length !== this.state.commands.length) {
            return [];
        }

        const modifiedCommands: chrome.commands.Command[] = currentCommands.filter((command: chrome.commands.Command, index: number) => {
            return command.shortcut !== this.state.commands[index].shortcut;
        });

        return modifiedCommands;
    }
}
