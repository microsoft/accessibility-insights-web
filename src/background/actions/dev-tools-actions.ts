// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class DevToolActions {
    public readonly setDevToolState = new Action<boolean>();
    public readonly setInspectElement = new Action<string[]>();
    public readonly setFrameUrl = new Action<string>();
    public readonly getCurrentState = new Action();
}
