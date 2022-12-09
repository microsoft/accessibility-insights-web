// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectionFailedPayload } from 'background/actions/action-payloads';
import { AsyncAction } from 'common/flux/async-action';

export class InjectionActions {
    public readonly injectionCompleted = new AsyncAction();
    public readonly injectionStarted = new AsyncAction();
    public readonly injectionFailed = new AsyncAction<InjectionFailedPayload>();
}
