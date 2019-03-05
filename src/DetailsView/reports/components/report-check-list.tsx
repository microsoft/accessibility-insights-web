// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { RuleResult } from '../../../scanner/iruleresults';
import { GuidanceLinks } from '../../components/guidance-links';
import { InlineImage, InlineImageType } from './inline-image';
import { ReportInstanceList } from './report-instance-list';

export interface ReportCheckListProps {
    results: RuleResult[];
    idPrefix: string;
    showInstanceCount: boolean;
    showInstances: boolean;
    congratulateIfEmpty: boolean;
}

export class ReportCheckList extends React.Component<ReportCheckListProps> {
    public render(): JSX.Element {
        if (this.props.congratulateIfEmpty && this.props.results.length === 0) {
            return this.renderCongratulations();
        }

        return <ul className="report-checks">{this.renderResults()}</ul>;
    }

    private renderCongratulations(): JSX.Element {
        return (
            <div className="report-congrats" key="report-congrats">
                <div className="report-congrats-image">
                    <InlineImage type={InlineImageType.AdaLaptop} alt="" />
                </div>
                <div className="report-congrats-screen">
                    <div className="report-congrats-message">
                        <div className="report-congrats-head">Congratulations!</div>
                        <div className="report-congrats-info">No failed checks were found.</div>
                    </div>
                </div>
            </div>
        );
    }

    private renderResults(): JSX.Element[] {
        return this.props.results.map((result, index) => {
            return (
                <li className="report-check" key={`report-check-${index}`}>
                    <div className="report-check-top">
                        <NewTabLink href={result.helpUrl} aria-describedby={`check-help-${this.props.idPrefix}-${index}`}>
                            {result.id}:
                        </NewTabLink>{' '}
                        <span id={`check-help-${this.props.idPrefix}-${index}`}>{result.help}</span>{' '}
                        {this.renderInstanceCount(result.nodes)}
                        <GuidanceLinks links={result.guidanceLinks} />
                    </div>
                    {this.renderResultInstances(result.nodes)}
                </li>
            );
        });
    }

    private renderResultInstances(nodeResults: AxeNodeResult[]): JSX.Element {
        if (this.props.showInstances === true && nodeResults.length > 0) {
            return <ReportInstanceList nodeResults={nodeResults} />;
        }
    }

    private renderInstanceCount(nodeResults: AxeNodeResult[]): JSX.Element {
        if (this.props.showInstanceCount === true) {
            return <span>({nodeResults.length}) </span>;
        }
    }
}
