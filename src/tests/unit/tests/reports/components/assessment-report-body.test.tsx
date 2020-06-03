// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    AssessmentReportBody,
    AssessmentReportBodyDeps,
    AssessmentReportBodyProps,
} from 'reports/components/assessment-report-body';
import { AssessmentReportBuilderTestHelper } from '../../DetailsView/assessment-report-builder-test-helper';

describe('AssessmentReportBody', () => {
    test('render', () => {
        const deps: AssessmentReportBodyDeps = {
            outcomeTypeSemanticsFromTestStatus: {
                stub: 'outcomeTypeSemanticsFromTestStatus',
            } as any,
        } as AssessmentReportBodyDeps;

        const featureFlagStoreData: FeatureFlagStoreData = { stub: 'featureFlagStoreData' } as any;

        const props: AssessmentReportBodyProps = {
            deps: deps,
            data: AssessmentReportBuilderTestHelper.getAssessmentReportModel(),
            description: 'test-description',
            featureFlagStoreData: featureFlagStoreData,
        };

        const wrapper = shallow(<AssessmentReportBody {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
