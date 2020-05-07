// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { BaseActionPayload } from './action-payloads';

export interface ContentPayload extends BaseActionPayload {
    contentPath: string;
    contentTitle: string;
}

export class ContentActions {
    public readonly openContentPanel = new Action<ContentPayload>();
    public readonly closeContentPanel = new Action<void>();
}
