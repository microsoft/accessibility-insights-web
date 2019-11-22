// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SHORTCUT_CONFIGURE_OPEN } from 'common/extension-telemetry-events';
import { Messages } from 'common/messages';

import { Interpreter } from '../interpreter';
import { ShortcutsPageController } from '../shortcuts-page-controller';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';

export class ShortcutsPageActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly shortcutsPageController: ShortcutsPageController,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.Shortcuts.ConfigureShortcuts, this.onConfigureShortcuts);
    }

    private onConfigureShortcuts = async (payload: BaseActionPayload): Promise<void> => {
        await this.shortcutsPageController.openShortcutsTab();
        this.telemetryEventHandler.publishTelemetry(SHORTCUT_CONFIGURE_OPEN, payload);
    };
}
