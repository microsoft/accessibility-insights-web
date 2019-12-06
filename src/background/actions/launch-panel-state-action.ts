// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { LaunchPanelType } from '../../popup/components/popup-view';

export class LaunchPanelStateActions {
    public readonly setLaunchPanelType = new Action<LaunchPanelType>();
    public readonly getCurrentState = new Action();
}
