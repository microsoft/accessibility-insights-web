// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { TelemetryEventSource } from './extension-telemetry-events';
import { DropdownActionMessageCreator } from './message-creators/dropdown-action-message-creator';

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

    public openPreviewFeaturesPanelHandler = (event: React.MouseEvent<HTMLElement>): void => {
        this.dropdownActionMessageCreator.openPreviewFeaturesPanel(event, this.source);
    };

    public openScopingPanelHandler = (event: React.MouseEvent<HTMLElement>): void => {
        this.dropdownActionMessageCreator.openScopingPanel(event, this.source);
    };

    public openSettingsPanelHandler = (event: React.MouseEvent<HTMLElement>): void => {
        this.dropdownActionMessageCreator.openSettingsPanel(event, this.source);
    };

    public openDebugTools = (): void => {
        this.dropdownActionMessageCreator.openDebugTools();
    };
}
