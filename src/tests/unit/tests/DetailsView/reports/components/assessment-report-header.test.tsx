// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { AssessmentReportHeader } from '../../../../../../DetailsView/reports/components/assessment-report-header';

describe('AssessmentReportHeader', () => {
    it('renders', () => {
        const wrapper = shallow(<AssessmentReportHeader targetPageUrl="test url" targetPageTitle="test title" />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
