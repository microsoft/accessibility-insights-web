// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { NamedFC } from 'common/react/named-fc';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    ManualTestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { AssessmentInstanceTable } from 'DetailsView/components/assessment-instance-table';
import { ManualTestStepView } from 'DetailsView/components/manual-test-step-view';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';

export type RequirementTableSectionProps = {
    assessmentNavState: AssessmentNavState;
    requirement: Requirement;
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    scanningInProgress: boolean;
    manualRequirementResultMap: DictionaryStringTo<ManualTestStepResult>;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    isRequirementScanned: boolean;
    selectedRequirementHasVisualHelper: boolean;
};

export const RequirementTableSection = NamedFC<RequirementTableSectionProps>(
    'RequirementTableSection',
    props => {
        if (props.requirement.isManual) {
            return (
                <ManualTestStepView
                    test={props.assessmentNavState.selectedTestType}
                    step={props.assessmentNavState.selectedTestSubview}
                    manualTestStepResultMap={props.manualRequirementResultMap}
                    assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
                    assessmentsProvider={props.assessmentsProvider}
                    featureFlagStoreData={props.featureFlagStoreData}
                    pathSnippetStoreData={props.pathSnippetStoreData}
                />
            );
        }

        if (props.scanningInProgress) {
            return (
                <Spinner
                    className="details-view-spinner"
                    size={SpinnerSize.large}
                    label={'Scanning'}
                />
            );
        }

        const renderScanCompleteAlert = () => {
            if (!props.requirement.isManual && props.isRequirementScanned) {
                return <div role="alert" aria-live="polite" aria-label="Scan Complete" />;
            }
        };

        return (
            <React.Fragment>
                {renderScanCompleteAlert()}
                <h3>Instances</h3>
                <AssessmentInstanceTable
                    instancesMap={props.instancesMap}
                    assessmentInstanceTableHandler={props.assessmentInstanceTableHandler}
                    assessmentNavState={props.assessmentNavState}
                    instanceTableHeaderType={props.requirement.instanceTableHeaderType}
                    getDefaultMessage={props.requirement.getDefaultMessage}
                    assessmentDefaultMessageGenerator={props.assessmentDefaultMessageGenerator}
                    hasVisualHelper={props.selectedRequirementHasVisualHelper}
                />
            </React.Fragment>
        );
    },
);
