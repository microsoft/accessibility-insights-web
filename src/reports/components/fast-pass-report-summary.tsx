// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { requirements } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { FastPassReportResultData } from 'reports/components/fast-pass-report';
import { OutcomeSummaryBar } from 'reports/components/outcome-summary-bar';
import { OutcomeStats } from 'reports/components/outcome-type';
import { RequirementOutcomeType } from 'reports/components/requirement-outcome-type';

export type FastPassReportSummaryDeps = {
    tabStopsFailedCounter: TabStopsFailedCounter;
};

export interface FastPassReportSummaryProps {
    deps: FastPassReportSummaryDeps;
    results: FastPassReportResultData;
}

export const allOutcomeTypes: RequirementOutcomeType[] = ['fail', 'incomplete', 'pass'];

export class FastPassReportSummary extends React.Component<FastPassReportSummaryProps> {
    public render(): JSX.Element {
        const { results, deps } = this.props;
        const failedTabResults: TabStopsRequirementResult[] = [];
        const incompleteTabResults: TabStopsRequirementResult[] = [];
        const passedTabResults: TabStopsRequirementResult[] = [];

        for (const [requirementId, data] of Object.entries(results.tabStops)) {
            const resultsObject = {
                id: requirementId,
                name: requirements[requirementId].name,
                description: requirements[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            } as TabStopsRequirementResult;
            if (data.status === 'fail') {
                failedTabResults.push(resultsObject);
            }
            if (data.status === 'pass') {
                passedTabResults.push(resultsObject);
            }
            if (data.status === 'unknown') {
                incompleteTabResults.push(resultsObject);
            }
        }

        const totalFailedTabInstancesCount: number =
            deps.tabStopsFailedCounter.getTotalFailed(failedTabResults);
        const totalIncompleteTabCount: number = incompleteTabResults.length;
        const totalPassedTabCount: number = passedTabResults.length;

        const getTotalAutomatedChecksFailed = (): number => {
            if (results.automatedChecks === null) {
                return 0;
            }
            return results.automatedChecks.cards.fail.reduce((total, rule) => {
                return total + rule.nodes.length;
            }, 0);
        };

        const totalfailedAutomatedChecks: number = getTotalAutomatedChecksFailed();
        const passedAutomatedChecks =
            results.automatedChecks !== null ? results.automatedChecks.cards.pass.length : 0;
        const incompleteAutomatedChecks =
            results.automatedChecks !== null ? results.automatedChecks.cards.unknown.length : 0;

        const stats: Partial<OutcomeStats> = {
            fail: totalfailedAutomatedChecks + totalFailedTabInstancesCount,
            incomplete: incompleteAutomatedChecks + totalIncompleteTabCount,
            pass: passedAutomatedChecks + totalPassedTabCount,
        };

        return (
            <div className="summary-section">
                <h2>Summary</h2>
                <OutcomeSummaryBar outcomeStats={stats} allOutcomeTypes={allOutcomeTypes} />
            </div>
        );
    }
}
