// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Messages } from '../../common/messages';
import { SHORTCUT_CONFIGURE_OPEN } from '../../common/telemetry-events';
import { ChromeShortcutsPageController } from '../chrome-shortcuts-page-controller';
import { Interpreter } from '../interpreter';
import { TelemetryEventHandler } from '../telemetry/telemetry-event-handler';
import { BaseActionPayload } from './action-payloads';

export class ShortcutsPageActionCreator {
    constructor(
        private readonly interpreter: Interpreter,
        private readonly shortcutsPageController: ChromeShortcutsPageController,
        private readonly telemetryEventHandler: TelemetryEventHandler,
    ) {}

    public registerCallbacks(): void {
        this.interpreter.registerTypeToPayloadCallback(Messages.ChromeFeature.configureCommand, this.onOpenConfigureCommandTab);
    }

    private onOpenConfigureCommandTab = (payload: BaseActionPayload): void => {
        this.shortcutsPageController.openShortcutsTab();
        this.telemetryEventHandler.publishTelemetry(SHORTCUT_CONFIGURE_OPEN, payload);
    };
}
