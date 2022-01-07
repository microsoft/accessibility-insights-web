// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { requirements } from 'DetailsView/components/tab-stops/requirements';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
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
        const tabResults = [];

        for (const [requirementId, data] of Object.entries(this.props.results.tabStops)) {
            if (data.status !== 'fail') {
                continue;
            }

            tabResults.push({
                id: requirementId,
                name: requirements[requirementId].name,
                description: requirements[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            });
        }

        const totalFailedTabInstancesCount: number =
            this.props.deps.tabStopsFailedCounter.getTotalFailed(tabResults);

        const passedTabResults = [];
        for (const [requirementId, data] of Object.entries(this.props.results.tabStops)) {
            if (data.status !== 'pass') {
                continue;
            }

            passedTabResults.push({
                id: requirementId,
                name: requirements[requirementId].name,
                description: requirements[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            });
        }

        const totalPassedTabCount: number = passedTabResults.length;

        const incompleteTabResults = [];
        for (const [requirementId, data] of Object.entries(this.props.results.tabStops)) {
            if (data.status !== 'unknown') {
                continue;
            }

            incompleteTabResults.push({
                id: requirementId,
                name: requirements[requirementId].name,
                description: requirements[requirementId].description,
                instances: data.instances,
                isExpanded: data.isExpanded,
            });
        }
        const totalIncompleteTabCount: number = incompleteTabResults.length;

        const failedAutomatedChecks = this.props.results.automatedChecks.cards.fail.length;
        const passedAutomatedChecks = this.props.results.automatedChecks.cards.pass.length;
        const incompleteAutomatedChecks = this.props.results.automatedChecks.cards.unknown.length;

        const stats: Partial<OutcomeStats> = {
            fail: failedAutomatedChecks + totalFailedTabInstancesCount,
            incomplete: incompleteAutomatedChecks + totalIncompleteTabCount, //incomplete automated checks to be added in 1906107
            pass: passedAutomatedChecks + totalPassedTabCount,
        };

        return (
            <>
                <h2>Summary</h2>
                <OutcomeSummaryBar outcomeStats={stats} allOutcomeTypes={allOutcomeTypes} />
            </>
        );
    }
}
