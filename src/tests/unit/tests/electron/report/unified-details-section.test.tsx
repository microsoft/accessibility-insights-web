// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from 'common/date-provider';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { UnifiedDetailsSection } from 'electron/views/report/unified-details-section';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DetailsSectionProps } from 'reports/components/report-sections/details-section';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('UnifiedDetailsSection', () => {
    const scanDate = new Date(Date.UTC(2020, 0, 1, 2, 3));
    const timestampStr = 'timestamp';
    const device = 'connected device';
    const name = 'app name';

    const descriptionValues = ['description-text', '', undefined, null];

    test.each(descriptionValues)('renders with description: %s', description => {
        const toUtcStringMock: IMock<(date: Date) => string> = Mock.ofInstance(
            DateProvider.getUTCStringFromDate,
            MockBehavior.Strict,
        );

        toUtcStringMock.setup(getter => getter(scanDate)).returns(() => timestampStr);

        const targetAppInfo = {
            name: name,
            device: device,
        } as TargetAppData;

        const props: DetailsSectionProps = {
            targetAppInfo,
            description,
            scanDate,
            toUtcString: toUtcStringMock.object,
        };

        const wrapper = shallow(<UnifiedDetailsSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
