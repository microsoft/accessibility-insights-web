// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { DateProvider } from 'common/date-provider';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';

import {
    DetailsSectionProps,
    makeDetailsSectionFC,
    ScanDetailInfo,
} from 'reports/components/report-sections/make-details-section-fc';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { CommentIcon } from '../../../../../../common/icons/comment-icon';
import { DateIcon } from '../../../../../../common/icons/date-icon';
import { UrlIcon } from '../../../../../../common/icons/url-icon';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../common/icons/date-icon');
jest.mock('../../../../../../common/icons/url-icon');
jest.mock('../../../../../../common/icons/comment-icon');

describe('makeDetailsSection', () => {
    mockReactComponents([CommentIcon, UrlIcon, DateIcon]);
    const scanDate = new Date(Date.UTC(2018, 2, 9, 9, 48));
    const appName = 'app-name';
    const url = 'https://page-url/';
    const targetAppInfo = {
        name: appName,
        url: url,
    };
    const deviceName = 'device-name';
    const scanMetadata = {
        targetAppInfo,
        deviceName,
        timespan: {
            scanComplete: scanDate,
        },
    } as ScanMetadata;
    const displayedScanTargetInfo: ScanDetailInfo = {
        label: 'item label',
        content: 'item content',
    };
    let toUtcStringMock: IMock<(date: Date) => string>;
    let getDisplayedScanTargetInfoMock: IMock<(scanMetadata: ScanMetadata) => ScanDetailInfo>;

    beforeEach(() => {
        toUtcStringMock = Mock.ofInstance(DateProvider.getUTCStringFromDate, MockBehavior.Strict);
        toUtcStringMock.setup(getter => getter(scanDate)).returns(() => '2018-03-12 11:24 PM UTC');
        getDisplayedScanTargetInfoMock =
            Mock.ofType<(scanMetadata: ScanMetadata) => ScanDetailInfo>();
        getDisplayedScanTargetInfoMock
            .setup(g => g(scanMetadata))
            .returns(() => displayedScanTargetInfo);
    });

    const descriptionValues = ['description-text', '', undefined, null];

    test.each(descriptionValues)('renders with description: %s', description => {
        const props: DetailsSectionProps = {
            description,
            toUtcString: toUtcStringMock.object,
            scanMetadata,
        };

        const TestDetailsSection = makeDetailsSectionFC(getDisplayedScanTargetInfoMock.object);

        const renderResult = render(<TestDetailsSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
