// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentPageComponent } from 'views/content/content-page';

export type TestViewType = 'AdhocStatic' | 'AdhocFailure' | 'AdhocNeedsReview' | 'Assessment';
export type TestViewOverrides = {
    content?: ContentPageComponent;
    guidance?: ContentPageComponent;
};
