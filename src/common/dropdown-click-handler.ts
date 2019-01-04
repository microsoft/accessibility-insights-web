// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { DropdownActionMessageCreator } from './message-creators/dropdown-action-message-creator';
import { TelemetryEventSource } from './telemetry-events';

export class DropdownClickHandler {
    private dropdownActionMessageCreator: DropdownActionMessageCreator;
    private source: TelemetryEventSource;

    constructor(
        dropdownActionMessageCreator: DropdownActionMessageCreator,
        source: TelemetryEventSource,
    ) {
        this.source = source;
        this.dropdownActionMessageCreator = dropdownActionMessageCreator;
    }

    @autobind
    public openPreviewFeaturesPanelHandler(event: React.MouseEvent<HTMLElement>): void {
        this.dropdownActionMessageCreator.openPreviewFeaturesPanel(event, this.source);
    }

    @autobind
    public openScopingPanelHandler(event: React.MouseEvent<HTMLElement>): void {
        this.dropdownActionMessageCreator.openScopingPanel(event, this.source);
    }

    @autobind
    public openSettingsPanelHandler(event: React.MouseEvent<HTMLElement>): void {
        this.dropdownActionMessageCreator.openSettingsPanel(event, this.source);
    }
}
