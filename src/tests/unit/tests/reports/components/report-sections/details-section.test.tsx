// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { getUrlItemInfo } from 'reports/components/report-sections/details-section';

describe('DetailsSection', () => {
    const appName = 'app-name';
    const url = 'https://page-url/';

    it('getUrlItemInfo', () => {
        const targetAppInfo = {
            name: appName,
            url: url,
        };
        const expectedLabel = 'target page url:';

        const urlItemInfo = getUrlItemInfo(targetAppInfo, undefined);

        expect(urlItemInfo.label).toEqual(expectedLabel);
        expect(React.isValidElement('hello'));
        expect(urlItemInfo).toMatchSnapshot();
    });
});
