// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentPagesInfo } from 'electron/types/content-page-info';
import { TestConfig } from 'electron/types/test-config';

export const createContentPagesInfo = (configs: TestConfig[]): ContentPagesInfo => {
    const retVal = {} as ContentPagesInfo;

    configs.forEach(config => (retVal[config.key] = config.contentPageInfo));

    return retVal;
};
