// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentPageInfo } from './content-page-info';
import { LeftNavItemKey } from './left-nav-item-key';

export type TestConfig = {
    key: LeftNavItemKey;
    contentPageInfo: ContentPageInfo;
    featureFlag?: string;
};
