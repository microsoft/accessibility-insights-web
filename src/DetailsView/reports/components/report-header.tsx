// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { title } from '../../../content/strings/application';
import { RuleResult, ScanResults } from '../../../scanner/iruleresults';
import { InlineImage, InlineImageType } from './inline-image';

export interface ReportHeaderProps {
    scanResult: ScanResults;
}

export class ReportHeader extends React.Component<ReportHeaderProps> {
    public render(): JSX.Element {
        return (
            <div className="report-header" role="banner">
                <h1>
                    <InlineImage type={InlineImageType.InsightsLogo48} alt="" />
                    {title} automated checks result
                </h1>
                <h2>Summary</h2>
                <nav>
                    <div>
                        <InlineImage type={InlineImageType.FailIcon} alt="" />
                        <a href="#failed">
                            {this.props.scanResult.violations.length}
                            {' failed checks '}
                            {this.renderFailureCountIfNonzero(this.props.scanResult.violations)}
                        </a>
                    </div>
                    <div>
                        <InlineImage type={InlineImageType.PassIcon} alt="" />
                        <a href="#passed">{`${this.props.scanResult.passes.length} passed checks`}</a>
                    </div>
                    <div>
                        <InlineImage type={InlineImageType.NotApplicableIcon} alt="" />
                        <a href="#notapplicable">{`${this.props.scanResult.inapplicable.length} not applicable checks`}</a>
                    </div>
                </nav>
            </div>
        );
    }

    private renderFailureCountIfNonzero(results: RuleResult[]): JSX.Element {
        const failureCount = this.getInstanceCount(results);
        if (failureCount > 0) {
            return <span>({failureCount} failures)</span>;
        }
    }

    private getInstanceCount(results: RuleResult[]): number {
        let instanceCount = 0;
        results.forEach(result => {
            instanceCount += result.nodes.length;
        });
        return instanceCount;
    }
}
