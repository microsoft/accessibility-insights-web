// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { TestConfig } from 'electron/types/test-config';
import { ContentPageInfo, ContentPagesInfo } from 'electron/types/content-page-info';
import { createContentPagesInfo } from 'electron/common/content-page-info-factory';

describe('content page info factory', () => {
    it('creates array of ContentPageInfo objects as expected', () => {
        const configs: TestConfig[] = [
            {
                key: 'automated-checks',
                title: 'my title1',
                description: <>Description1</>,
            } as TestConfig,
            {
                key: 'needs-review',
                title: 'my title2',
                description: <>Description2</>,
            } as TestConfig,
        ];

        const expectedItems = {} as ContentPagesInfo;
        expectedItems['automated-checks'] = {
            title: 'my title1',
            description: <>Description1</>,
        } as ContentPageInfo;
        expectedItems['needs-review'] = {
            title: 'my title2',
            description: <>Description2</>,
        } as ContentPageInfo;

        const actualItems = createContentPagesInfo(configs);

        expect(actualItems).toMatchObject(expectedItems);
    });
});
