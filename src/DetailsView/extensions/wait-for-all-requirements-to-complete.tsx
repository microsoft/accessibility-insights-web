// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import * as React from 'react';

import { AssessmentViewMainContentExtensionPoint } from '../components/assessment-view';
import { OutcomeMath } from '../reports/components/outcome-math';

export const waitForAllRequirementsToComplete = AssessmentViewMainContentExtensionPoint.create(props => {
    const { assessmentTestResult, children } = props;

    const outcomeStats = assessmentTestResult.getOutcomeStats();
    if (outcomeStats.incomplete > 0) {
        const percentage = OutcomeMath.percentageComplete(outcomeStats);

        return <Spinner className="details-view-spinner" size={SpinnerSize.large} label={`Scanning ${percentage}%`} />;
    }

    return <>{children}</>;
});
