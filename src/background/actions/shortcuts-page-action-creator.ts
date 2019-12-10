// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SHORTCUT_CONFIGURE_OPEN } from 'common/extension-telemetry-events';
import { Logger } from 'common/logging/logger';
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
        private readonly logger: Logger,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(
            Messages.Shortcuts.ConfigureShortcuts,
            this.onConfigureShortcuts,
        );
    }

    private onConfigureShortcuts = async (payload: BaseActionPayload): Promise<void> => {
        this.shortcutsPageController.openShortcutsTab().catch(this.logger.error);
        this.telemetryEventHandler.publishTelemetry(SHORTCUT_CONFIGURE_OPEN, payload);
    };
}
