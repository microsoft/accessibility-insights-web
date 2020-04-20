// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
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
        } as ScanMetaData;
        const expectedLabel = 'target page url:';

        const urlItemInfo = getUrlItemInfo(scanMetadata);

        expect(urlItemInfo.label).toEqual(expectedLabel);
        expect(React.isValidElement('hello'));
        expect(urlItemInfo).toMatchSnapshot();
    });
});
