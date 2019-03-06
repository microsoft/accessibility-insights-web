// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { BugActionMessageCreator } from './message-creators/bug-action-message-creator';
import { TelemetryEventSource } from './telemetry-events';

export class BugClickHandler {
    constructor(private bugActionMessageCreator: BugActionMessageCreator, private source: TelemetryEventSource) {}

    @autobind
    public openSettingsPanelHandler(event: React.MouseEvent<HTMLElement>): void {
        this.bugActionMessageCreator.openSettingsPanel(event);
    }
}
