// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { Target } from 'scanner/iruleresults';

export class DevToolActions {
    public readonly setDevToolState = new Action<boolean>();
    public readonly setInspectElement = new Action<Target>();
    public readonly setFrameUrl = new Action<string>();
    public readonly getCurrentState = new Action();
}
