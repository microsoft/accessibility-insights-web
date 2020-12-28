// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { ManualTestStepResult } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import {
    RequirementTableSection,
    RequirementTableSectionProps,
} from 'DetailsView/components/left-nav/requirement-table-section';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { shallow } from 'enzyme';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';

describe('RequirementTableSection', () => {
    let props: RequirementTableSectionProps;
    let manualRequirementResultMapStub: DictionaryStringTo<ManualTestStepResult>;
    let assessmentInstanceTableHandlerStub: AssessmentInstanceTableHandler;
    let assessmentProviderStub: AssessmentsProvider;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;

    beforeEach(() => {
        assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;
        manualRequirementResultMapStub = {
            'some manual test step result id': null,
        };
        assessmentProviderStub = {
            all: null,
        } as AssessmentsProvider;
        featureFlagStoreDataStub = {
            'some feature flag': true,
        };
        pathSnippetStoreDataStub = {
            path: null,
        } as PathSnippetStoreData;

        props = {
            assessmentNavState: {
                selectedTestSubview: 'some test view',
                selectedTestType: -1,
            },
            manualRequirementResultMap: manualRequirementResultMapStub,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            assessmentsProvider: assessmentProviderStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
            requirement: {
                isManual: false,
                getDefaultMessage: _ => null,
                instanceTableHeaderType: 'none',
            },
        } as RequirementTableSectionProps;
    });

    test('render ManualTestStepView when requirement is manual', () => {
        props.requirement = {
            isManual: true,
        } as Requirement;

        const testObject = shallow(<RequirementTableSection {...props} />);

        expect(testObject.getElement()).toMatchSnapshot();
    });

    test('render Spinner when scanning in progress', () => {
        props.scanningInProgress = true;

        const testObject = shallow(<RequirementTableSection {...props} />);

        expect(testObject.getElement()).toMatchSnapshot();
    });

    test('render instance table', () => {
        const testObject = shallow(<RequirementTableSection {...props} />);

        expect(testObject.getElement()).toMatchSnapshot();
    });
});
