// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { SummaryDetails, SummaryDetailsProps } from '../../../../../../../DetailsView/reports/components/report-sections/summary-details';

describe('SummaryDetails', () => {
    it('renders', () => {
        const props: SummaryDetailsProps = {
            id: 'test-id',
            summaryContent: <div>this is the summary content</div>,
            summaryProps: {
                customProp: 'custom value',
            },
            detailsContent: <div> this is the details content </div>,
        };

        const wrapped = shallow(<SummaryDetails {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
