// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';

export class LaunchPanelStateActions {
    public readonly setLaunchPanelType = new AsyncAction<LaunchPanelType>();
    public readonly getCurrentState = new AsyncAction();
}
