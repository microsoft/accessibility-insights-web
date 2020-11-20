// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { TestConfig } from 'electron/types/test-config';
import { ContentPageInfo, ContentPagesInfo } from 'electron/types/content-page-info';
import { createContentPagesInfo } from 'electron/common/content-page-info-factory';
import { NamedFC } from 'common/react/named-fc';
import { CommonInstancesSectionProps } from 'common/components/cards/common-instances-section-props';

describe('createContentPagesInfo', () => {
    it('creates array of ContentPageInfo objects as expected', () => {
        const automatedChecksInfo = makeStubContentPageInfo('automated-checks');
        const needsReviewInfo = makeStubContentPageInfo('needs-review');

        const configs: TestConfig[] = [
            {
                key: 'automated-checks',
                contentPageInfo: automatedChecksInfo,
            },
            {
                key: 'needs-review',
                contentPageInfo: needsReviewInfo,
            },
        ];

        const expectedItems = {} as ContentPagesInfo;
        expectedItems['automated-checks'] = automatedChecksInfo;
        expectedItems['needs-review'] = needsReviewInfo;

        const actualItems = createContentPagesInfo(configs);

        expect(actualItems).toMatchObject(expectedItems);
    });

    function makeStubContentPageInfo(id: string): ContentPageInfo {
        return {
            title: `${id} stub title`,
            description: <p>`${id} stub description`</p>,
            instancesSectionComponent: NamedFC<CommonInstancesSectionProps>(
                `${id} instances section`,
                () => null,
            ),
            resultsFilter: _ => true,
            allowsExportReport: true,
        };
    }
});
