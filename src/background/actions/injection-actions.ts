// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';

export class InjectionActions {
    public readonly injectionCompleted = new AsyncAction();
    public readonly injectionStarted = new AsyncAction();
    public readonly injectionFailed = new AsyncAction();
}
