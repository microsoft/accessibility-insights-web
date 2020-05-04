// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import {
    outcomeTypeFromTestStatus,
    outcomeTypeSemanticsFromTestStatus,
} from 'reports/components/requirement-outcome-type';
import { AssessmentTestResult } from '../../../../../common/assessment/assessment-test-result';
import { GetGuidanceTagsFromGuidanceLinks } from '../../../../../common/get-guidance-tags-from-guidance-links';
import { getInnerTextFromJsxElement } from '../../../../../common/get-inner-text-from-jsx-element';
import { ContentActionMessageCreator } from '../../../../../common/message-creators/content-action-message-creator';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { AssessmentData } from '../../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../../../../../common/types/store-data/path-snippet-store-data';
import { UrlParser } from '../../../../../common/url-parser';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentViewDeps,
    AssessmentViewProps,
} from '../../../../../DetailsView/components/assessment-view';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import { contentProvider } from '../../../common/test-assessment-provider';

export class AssessmentViewPropsBuilder {
    public detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    public assessmentInstanceTableHandlerMock: IMock<AssessmentInstanceTableHandler>;
    private assessmentGeneratorInstance: AssessmentDefaultMessageGenerator;
    private content: JSX.Element = (<div>AssessmentViewTest content</div>);
    private isEnabled: boolean = false;
    private provider: AssessmentsProvider;

    constructor(provider: AssessmentsProvider, assessmentGeneratorInstanceMock) {
        this.detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        this.assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        this.assessmentGeneratorInstance = assessmentGeneratorInstanceMock;
        this.provider = provider;
    }

    public setIsEnabled(isEnabled: true): AssessmentViewPropsBuilder {
        this.isEnabled = isEnabled;
        return this;
    }

    public buildProps(
        generatedAssessmentInstancesMap = {},
        isTargetChanged = false,
        isStepScanned = false,
    ): AssessmentViewProps {
        const deps: AssessmentViewDeps = {
            contentProvider,
            contentActionMessageCreator: Mock.ofType(ContentActionMessageCreator).object,
            detailsViewActionMessageCreator: this.detailsViewActionMessageCreatorMock.object,
            assessmentsProvider: this.provider,
            outcomeTypeFromTestStatus: Mock.ofInstance(outcomeTypeFromTestStatus).object,
            getInnerTextFromJsxElement: Mock.ofInstance(getInnerTextFromJsxElement).object,
            outcomeTypeSemanticsFromTestStatus: Mock.ofInstance(outcomeTypeSemanticsFromTestStatus)
                .object,
            urlParser: Mock.ofType(UrlParser).object,
            getGuidanceTagsFromGuidanceLinks: Mock.ofType<GetGuidanceTagsFromGuidanceLinks>()
                .object,
        };
        const assessment = this.provider.all()[0];
        const firstStep = assessment.requirements[0];
        const anotherTarget = {
            id: 2,
            url: '2',
            title: '2',
        };
        const prevTarget = {
            id: 1,
            url: '1',
            title: '2',
            appRefreshed: false,
        };
        const assessmentNavState = {
            selectedTestSubview: firstStep.key,
            selectedTestType: assessment.visualizationType,
        };
        const assessmentData = {
            testStepStatus: {
                [firstStep.key]: {
                    stepFinalResult: ManualTestStatus.UNKNOWN,
                    isStepScanned: isStepScanned,
                },
            },
            generatedAssessmentInstancesMap: generatedAssessmentInstancesMap,
            manualTestStepResultMap: {},
        } as AssessmentData;

        const featureFlagStoreData = {} as FeatureFlagStoreData;
        const pathSnippetStoreData = {} as PathSnippetStoreData;

        const props: AssessmentViewProps = {
            deps,
            prevTarget,
            currentTarget: isTargetChanged ? anotherTarget : prevTarget,
            isScanning: false,
            isEnabled: this.isEnabled,
            content: this.content,
            assessmentNavState,
            assessmentInstanceTableHandler: this.assessmentInstanceTableHandlerMock.object,
            assessmentProvider: this.provider,
            assessmentData,
            assessmentDefaultMessageGenerator: this.assessmentGeneratorInstance,
            assessmentTestResult: new AssessmentTestResult(
                this.provider,
                assessment.visualizationType,
                assessmentData,
            ),
            featureFlagStoreData,
            pathSnippetStoreData,
        };

        return props;
    }

    public verifyAll(): void {
        this.detailsViewActionMessageCreatorMock.verifyAll();
    }
}
