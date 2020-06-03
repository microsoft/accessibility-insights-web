// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { FlaggedComponent } from 'common/components/flagged-component';
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ReflowAssessmentSummaryDetails } from 'reports/components/reflow-assessment-summary-details';
import { OverviewSummaryReportModel } from '../assessment-report-model';
import { AssessmentSummaryDetails } from './assessment-summary-details';
import { OutcomeSummaryBar } from './outcome-summary-bar';
import { allRequirementOutcomeTypes } from './requirement-outcome-type';

export interface AssessmentReportSummaryProps {
    summary: OverviewSummaryReportModel;
    featureFlagStoreData: FeatureFlagStoreData;
}

export class AssessmentReportSummary extends React.Component<AssessmentReportSummaryProps> {
    public render(): JSX.Element {
        return (
            <div className="assessment-report-summary">
                <h2>Summary</h2>
                <OutcomeSummaryBar
                    outcomeStats={this.props.summary.byPercentage}
                    countSuffix="%"
                    allOutcomeTypes={allRequirementOutcomeTypes}
                />
                <h3 className="test-details-text">Test details</h3>
                {this.renderDetails()}
            </div>
        );
    }

    private renderDetails(): JSX.Element {
        return (
            <FlaggedComponent
                featureFlag={FeatureFlags.exportReportOptions}
                featureFlagStoreData={this.props.featureFlagStoreData}
                enableJSXElement={
                    <ReflowAssessmentSummaryDetails
                        testSummaries={this.props.summary.reportSummaryDetailsData}
                    />
                }
                disableJSXElement={
                    <AssessmentSummaryDetails
                        testSummaries={this.props.summary.reportSummaryDetailsData}
                    />
                }
            />
        );
    }
}
