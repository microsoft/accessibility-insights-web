// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { BaseActionPayload } from './action-payloads';

export interface ContentPayload extends BaseActionPayload {
    contentPath: string;
    contentTitle: string;
}

export class ContentActions {
    public readonly openContentPanel = new AsyncAction<ContentPayload>();
    public readonly closeContentPanel = new AsyncAction<void>();
}
