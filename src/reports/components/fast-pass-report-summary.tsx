// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { OutcomeSummaryBar } from 'reports/components/outcome-summary-bar';
import { OutcomeStats } from 'reports/components/outcome-type';
import { allRequirementOutcomeTypes } from 'reports/components/requirement-outcome-type';

export interface FastPassReportSummaryProps {}

export class FastPassReportSummary extends React.Component<FastPassReportSummaryProps> {
    public render(): JSX.Element {

        const stats: Partial<OutcomeStats> = {
            pass: 5,
            incomplete: 10,
            fail: 1
        }

        return (
            <>
                <h2>Summary 2</h2>
                <OutcomeSummaryBar outcomeStats={stats} allOutcomeTypes={allRequirementOutcomeTypes}                    
                />
            </>
        );
    }
}
