// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Requirement } from 'assessments/types/requirement';
import { AssessmentTestResult } from 'common/assessment/assessment-test-result';
import { RequirementData, RequirementResult } from 'common/assessment/requirement';
import {
    AssessmentData,
    gettingStartedSubview,
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
    let assessmentDataStub = {} as AssessmentData;

    let requirementStub: Requirement;
    let requirementStubTwo: Requirement;
    let requirementResultStub: RequirementResult;
    let requirementResultStubTwo: RequirementResult;
    let assessmentTestResultStub: AssessmentTestResult;

    let assessmentInstanceTableHandlerStub: AssessmentInstanceTableHandler;

    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;

    let reflowProps: ReflowAssessmentViewProps;

    beforeEach(() => {
        assessmentDataStub = {} as AssessmentData;

        requirementStub = {
            name: 'test-requirement-name',
            description: <div>test-description</div>,
            howToTest: <p>how-to-test-stub</p>,
            order: 1,
        } as Requirement;
        requirementStubTwo = {
            name: 'test-requirement-name-2',
            description: <div>test-description</div>,
            howToTest: <p>how-to-test-stub</p>,
            order: 2,
        } as Requirement;
        requirementResultStub = {
            definition: requirementStub,
            data: { isStepScanned: true } as RequirementData,
        };
        requirementResultStubTwo = {
            definition: requirementStubTwo,
            data: { isStepScanned: true } as RequirementData,
        };
        assessmentTestResultStub = {
            definition: {
                gettingStarted: <h1>Hello</h1>,
                title: 'some title',
                guidance: { pageTitle: 'some page title' },
            },
            getRequirementResult: _ => requirementResultStub,
            getRequirementResults: () => [requirementResultStub, requirementResultStubTwo],
            visualizationType: -1,
        } as AssessmentTestResult;

        assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;

        featureFlagStoreDataStub = {
            'some feature flag': true,
        };
        pathSnippetStoreDataStub = {
            path: null,
        } as PathSnippetStoreData;

        reflowProps = {
            deps: {} as ReflowAssessmentViewDeps,
            prevTarget: { id: 4 },
            currentTarget: { id: 5 },
            scanningInProgress: true,
            selectedRequirementIsEnabled: true,
            assessmentNavState: {
                selectedTestType: -1,
            },
            assessmentData: assessmentDataStub,
            assessmentTestResult: assessmentTestResultStub,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
        } as ReflowAssessmentViewProps;
    });

    test('render for requirement', () => {
        reflowProps.assessmentNavState.selectedTestSubview = 'requirement';
        const rendered = shallow(<ReflowAssessmentView {...reflowProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render for getting started', () => {
        reflowProps.assessmentNavState.selectedTestSubview = gettingStartedSubview;
        const rendered = shallow(<ReflowAssessmentView {...reflowProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('render for requirement where nextRequirement is null', () => {
        reflowProps.assessmentNavState.selectedTestSubview = 'requirement';
        reflowProps.assessmentTestResult.getRequirementResult = _ => requirementResultStubTwo;
        const rendered = shallow(<ReflowAssessmentView {...reflowProps} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
