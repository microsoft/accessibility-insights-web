// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { AssessmentReport, AssessmentReportDeps } from 'reports/components/assessment-report';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';

describe('AssessmentReport', () => {
    test('render', () => {
        const deps: AssessmentReportDeps = {
            outcomeTypeSemanticsFromTestStatus: {
                stub: 'outcomeTypeSemanticsFromTestStatus',
            } as any,
        } as AssessmentReportDeps;

        const data = AssessmentReportBuilderTestHelper.getAssessmentReportModel();

        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;

        const wrapper = shallow(
            <AssessmentReport
                deps={deps}
                data={data}
                description="test string"
                extensionVersion="ProductVersion"
                axeVersion="axeVersion"
                chromeVersion="chromeVersion"
                featureFlagStoreData={featureFlagStoreData}
            />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
