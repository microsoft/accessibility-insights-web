import { ContentPageInfo, ContentPagesInfo } from 'electron/types/content-page-info';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TestConfig } from 'electron/types/test-config';

export const createContentPagesInfo = (configs: TestConfig[]): ContentPagesInfo => {
    const retVal = {} as ContentPagesInfo;

    configs.forEach(config => (retVal[config.key] = createContentPageInfo(config)));

    return retVal;
};

const createContentPageInfo = (config: TestConfig): ContentPageInfo => {
    return {
        title: config.title,
        description: config.description,
    };
};
