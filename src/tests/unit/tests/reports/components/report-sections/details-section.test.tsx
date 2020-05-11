// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { getUrlItemInfo } from 'reports/components/report-sections/details-section';

describe('DetailsSection', () => {
    const appName = 'app-name';
    const url = 'https://page-url/';

    it('getUrlItemInfo', () => {
        const scanMetadata = {
            targetAppInfo: {
                name: appName,
                url: url,
            },
        } as ScanMetadata;
        const expectedLabel = 'target page url:';

        const urlItemInfo = getUrlItemInfo(scanMetadata);

        expect(urlItemInfo.label).toEqual(expectedLabel);
        expect(React.isValidElement('hello'));
        expect(urlItemInfo).toMatchSnapshot();
    });
});
