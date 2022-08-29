// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { Target } from 'scanner/iruleresults';

export class DevToolActions {
    public readonly setDevToolState = new AsyncAction<boolean>();
    public readonly setInspectElement = new AsyncAction<Target>();
    public readonly setFrameUrl = new AsyncAction<string>();
    public readonly getCurrentState = new AsyncAction();
}
