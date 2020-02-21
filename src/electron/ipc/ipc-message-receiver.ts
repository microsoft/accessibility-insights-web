// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { Logger } from 'common/logging/logger';
import { InterpreterMessage } from 'common/message';
import { IpcRenderer, IpcRendererEvent } from 'electron';
import { isObject, isString } from 'lodash';
import { IPC_MESSAGE_CHANNEL_NAME } from './ipc-channel-names';

export class IpcMessageReceiver {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly underlyingIpcRenderer: IpcRenderer,
        private readonly logger: Logger,
    ) {}

    public initialize(): void {
        this.underlyingIpcRenderer.on(IPC_MESSAGE_CHANNEL_NAME, this.onMessageReceived);
    }

    private onMessageReceived = (event: IpcRendererEvent, ...args: any[]) => {
        if (event.senderId !== 0) {
            this.logger.error('Ignoring spoofed message from non-main-process senderId');
            return;
        }
        if (args.length !== 1 || !isObject(args[0]) || !isString(args[0]['messageType'])) {
            this.logger.error('Ignoring malformated message args');
            return;
        }

        const interpreterMessage = args[0] as InterpreterMessage;
        this.logger.log(
            `Received IPC message from main process (${interpreterMessage.messageType})`,
        );
        this.interpreter.interpret(interpreterMessage);
    };
}
