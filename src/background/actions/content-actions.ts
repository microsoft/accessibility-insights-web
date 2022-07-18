// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { BaseActionPayload } from './action-payloads';

export interface ContentPayload extends BaseActionPayload {
    contentPath: string;
    contentTitle: string;
}

export class ContentActions {
    public readonly openContentPanel = new SyncAction<ContentPayload>();
    public readonly closeContentPanel = new SyncAction<void>();
}
