// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { SummaryReportDetailsSection } from 'reports/components/report-sections/summary-report-details-section';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { IMock, Mock } from 'typemoq';
import { SummaryReportSectionProps } from 'reports/components/report-sections/summary-report-section-factory';
import { ScanTimespan } from 'reports/components/report-sections/base-summary-report-section-props';

describe(SummaryReportDetailsSection, () => {
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
        } as ScanMetadata;
        const props = {
            scanTimespan,
            scanMetadata,
            toUtcString: toUtcStringMock.object,
            secondsToTimeString: secondsToTimeStringMock.object,
        } as SummaryReportSectionProps;

        const wrapper = shallow(<SummaryReportDetailsSection {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
