// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { Messages } from 'common/messages';
import { DebugToolsController } from 'debug-tools/controllers/debug-tools-controller';

export class DebugToolsActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly debugToolsController: DebugToolsController,
    ) {}

    public registerCallback(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.DebugTools.Open,
            this.onOpenDebugTools,
        );
    }

    private onOpenDebugTools = async (): Promise<void> => {
        await this.debugToolsController.showDebugTools();
    };
}
