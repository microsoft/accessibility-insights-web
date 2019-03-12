// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from '../../../background/interpreter';

export class InterpreterStub extends Interpreter {
    public registerTypeToPayloadCallback(messageType: string, callback: IPayloadCallback): void {}

    public interpret(message: Message): boolean {
        return false;
    }
}
