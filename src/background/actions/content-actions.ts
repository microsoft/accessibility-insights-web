// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseActionPayload } from './action-payloads';
import { Action } from '../../common/flux/action';

export interface ContentPayload extends BaseActionPayload {
    contentPath: string;
}

export class ContentActions {
    public readonly openContentPanel = new Action<ContentPayload>();
    public readonly closeContentPanel = new Action<void>();
}
