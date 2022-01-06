// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { FastPassReportResultData } from 'reports/components/fast-pass-report';
import { OutcomeSummaryBar } from 'reports/components/outcome-summary-bar';
import { OutcomeStats } from 'reports/components/outcome-type';
import { allRequirementOutcomeTypes } from 'reports/components/requirement-outcome-type';

export interface FastPassReportSummaryProps {
    results: FastPassReportResultData;
}

export class FastPassReportSummary extends React.Component<FastPassReportSummaryProps> {
    public render(): JSX.Element {
        const stats: Partial<OutcomeStats> = {
            //hardcoded sample stats, real numbers in future PR
            pass: this.props.results.automatedChecks.cards.pass.length,
            incomplete: this.props.results.automatedChecks.cards.unknown.length,
            fail: this.props.results.automatedChecks.cards.fail.length,
        };

        return (
            <>
                <h2>Summary</h2>
                <OutcomeSummaryBar
                    outcomeStats={stats}
                    allOutcomeTypes={allRequirementOutcomeTypes}
                />
            </>
        );
    }
}
