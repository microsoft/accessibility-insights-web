// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { ScanMetadata, ScanTimespan } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { IMock, Mock } from 'typemoq';
import { DateIcon } from '../../../../../../common/icons/date-icon';
import { UrlIcon } from '../../../../../../common/icons/url-icon';
import { NewTabLinkWithConfirmationDialog } from '../../../../../../reports/components/new-tab-link-confirmation-dialog';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/new-tab-link-confirmation-dialog');
jest.mock('../../../../../../common/icons/date-icon');
jest.mock('../../../../../../common/icons/url-icon');
describe(SummaryReportDetailsSection.displayName, () => {
    mockReactComponents([NewTabLinkWithConfirmationDialog, UrlIcon, DateIcon]);
    const scanStart = new Date(0, 1, 2, 3);
    const scanComplete = new Date(4, 5, 6, 7);
    const durationSeconds = 10;

    const scanStartTimestamp = 'scan start time';
    const scanCompleteTimestamp = 'scan end time';
    const scanDurationString = 'scan duration';

    let toUtcStringMock: IMock<(date: Date) => string>;
    let secondsToTimeStringMock: IMock<(seconds: number) => string>;

    beforeEach(() => {
        toUtcStringMock = Mock.ofInstance(() => null);
        toUtcStringMock.setup(tus => tus(scanStart)).returns(() => scanStartTimestamp);
        toUtcStringMock.setup(tus => tus(scanComplete)).returns(() => scanCompleteTimestamp);

        secondsToTimeStringMock = Mock.ofInstance(() => null);
        secondsToTimeStringMock
            .setup(stt => stt(durationSeconds))
            .returns(() => scanDurationString);
    });

    it('renders', () => {
        const scanTimespan: ScanTimespan = {
            scanStart,
            scanComplete,
            durationSeconds,
        };
        const scanMetadata = {
            targetAppInfo: {
                name: 'page name',
                url: 'page url',
            },
            timespan: scanTimespan,
        } as ScanMetadata;
        const props = {
            scanMetadata,
            toUtcString: toUtcStringMock.object,
            secondsToTimeString: secondsToTimeStringMock.object,
        } as SummaryReportSectionProps;

        const renderResult = render(<SummaryReportDetailsSection {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
