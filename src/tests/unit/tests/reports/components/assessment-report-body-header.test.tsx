// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { AssessmentReportBodyHeader } from 'reports/components/assessment-report-body-header';

describe('AssessmentReportBodyHeader', () => {
    describe('render', () => {
        test('render function test', () => {
            const wrapper = shallow(<AssessmentReportBodyHeader />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
