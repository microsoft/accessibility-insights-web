// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { AssessmentTestResult } from 'common/assessment/assessment-test-result';
import { RequirementData, RequirementResult } from 'common/assessment/requirement';
import {
    AssessmentData,
    GettingStarted,
    gettingStartedSubview,
    RequirementName,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    ReflowAssessmentView,
    ReflowAssessmentViewDeps,
    ReflowAssessmentViewProps,
} from '../../../../../DetailsView/components/reflow-assessment-view';

describe('AssessmentViewTest', () => {
    test('render for requirement', () => {
        const props = generateProps('requirement');
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render for gettting started', () => {
        const props = generateProps(gettingStartedSubview);
        const rendered = shallow(<ReflowAssessmentView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    function generateProps(subview: RequirementName | GettingStarted): ReflowAssessmentViewProps {
        const assessmentDataStub = {} as AssessmentData;

        const requirementStub = {
            name: 'test-requirement-name',
            description: <div>test-description</div>,
            howToTest: <p>how-to-test-stub</p>,
        } as Requirement;
        const requirementResultStub: RequirementResult = {
            definition: requirementStub,
            data: { isStepScanned: true } as RequirementData,
        };
        const getRequirementResultStub = (requirementKey: string) => {
            return requirementResultStub;
        };
        const assessmentTestResultStub: AssessmentTestResult = {
            definition: {
                gettingStarted: <h1>Hello</h1>,
            },
            getRequirementResult: getRequirementResultStub,
        } as AssessmentTestResult;

        const assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;

        const featureFlagStoreDataStub: FeatureFlagStoreData = {
            'some feature flag': true,
        };
        const pathSnippetStoreDataStub = {
            path: null,
        } as PathSnippetStoreData;

        const reflowProps = {
            deps: {} as ReflowAssessmentViewDeps,
            prevTarget: { id: 4 },
            currentTarget: { id: 5 },
            scanningInProgress: true,
            selectedRequirementIsEnabled: true,
            assessmentNavState: {
                selectedTestSubview: subview,
                selectedTestType: -1,
            },
            assessmentData: assessmentDataStub,
            assessmentTestResult: assessmentTestResultStub,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
        } as ReflowAssessmentViewProps;
        return reflowProps;
    }
});
