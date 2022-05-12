// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from 'common/messages';
import { Interpreter } from './interpreter';

export class PingResponder {
    constructor(private readonly intepreter: Interpreter) {}

    public initialize() {
        this.intepreter.registerTypeToPayloadCallback(Messages.Common.Ping, this.onPing);
    }

    private onPing = async (): Promise<string> => {
        return 'pong';
    };
}
