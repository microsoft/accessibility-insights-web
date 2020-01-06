// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import * as React from 'react';
import { OutcomeMath } from 'reports/components/outcome-math';
import { AssessmentViewMainContentExtensionPoint } from '../components/assessment-view';

export const waitForAllRequirementsToComplete = AssessmentViewMainContentExtensionPoint.create(props => {
    const { assessmentTestResult, children } = props;

    const outcomeStats = assessmentTestResult.getOutcomeStats();
    if (outcomeStats.incomplete > 0) {
        const percentage = OutcomeMath.percentageComplete(outcomeStats);

        return <ScanningSpinner isSpinning={true} label={`Scanning ${percentage}%`} />;
    }

    return <>{children}</>;
});
