// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { AssessmentDefaultMessageGenerator } from '../../../../../assessments/assessment-default-message-generator';
import { IAssessment } from '../../../../../assessments/types/iassessment';
import { IAssessmentsProvider } from '../../../../../assessments/types/iassessments-provider';
import { AssessmentTestResult } from '../../../../../common/assessment/assessment-test-result';
import { IAssessmentData, IAssessmentNavState, IAssessmentStoreData } from '../../../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../../../common/types/store-data/itab-store-data';
import { AssessmentView, AssessmentViewDeps, IAssessmentViewProps } from '../../../../../DetailsView/components/assessment-view';
import { AssessmentViewFactory } from '../../../../../DetailsView/components/assessment-view-factory';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

describe('AssessmentViewFactoryTest', () => {
    let provider: IAssessmentsProvider;
    let testObject: AssessmentViewFactory;
    let assessment: IAssessment;
    let assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;

    beforeEach(() => {
        provider = CreateTestAssessmentProvider();
        assessment = provider.all()[0];
        assessmentDefaultMessageGenerator = new AssessmentDefaultMessageGenerator();
        testObject = new AssessmentViewFactory(provider, assessmentDefaultMessageGenerator);
    });

    test('create headings assessment view', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        const isScanning = false;
        const stepKey = assessment.steps[0].key;

        const assessmentNavState: IAssessmentNavState = {
            selectedTestType: assessment.type,
            selectedTestStep: stepKey,
        };

        const assessmentData: IAssessmentData = {
            testStepStatus: {},
            fullAxeResultsMap: {},
            generatedAssessmentInstancesMap: {},
        };

        const prevTarget = {
            id: 1,
            url: 'url',
            title: 'title',
        };

        const assessmentState: IAssessmentStoreData = {
            targetTab: prevTarget,
            assessments: {
                [assessment.key]: assessmentData,
            },
            assessmentNavState: assessmentNavState,
        };

        const tabStoreData: ITabStoreData = {
            id: 1,
            url: 'url',
            title: 'title',
        } as ITabStoreData;

        const visualizationStoreState = {
            [stepKey]: {
                enabled: false,
            },
        };

        const deps = Mock.ofType<AssessmentViewDeps>().object;

        const result = testObject.create(
            deps,
            assessmentInstanceTableHandlerMock.object,
            assessmentState,
            tabStoreData,
            false,
            isScanning,
        );

        const expectedProps: IAssessmentViewProps = {
            deps,
            isScanning: isScanning,
            isEnabled: visualizationStoreState[stepKey].enabled,
            assessmentNavState: assessmentNavState,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerMock.object,
            assessmentProvider: provider,
            assessmentData: assessmentData,
            currentTarget: tabStoreData,
            prevTarget: prevTarget,
            assessmentDefaultMessageGenerator: assessmentDefaultMessageGenerator,
            assessmentTestResult: new AssessmentTestResult(provider, assessmentNavState.selectedTestType, assessmentData),
        };

        const expected = <AssessmentView {...expectedProps} />;
        expect(shallow(<div>{result}</div>).debug()).toEqual(shallow(<div>{expected}</div>).debug());

    });
});

