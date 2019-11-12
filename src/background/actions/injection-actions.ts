// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';

export class InjectionActions {
    public readonly injectionCompleted = new Action();
    public readonly injectionStarted = new Action();
}
