// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export interface IReportInstanceListProps {
    nodeResults: AxeNodeResult[];
}

export class ReportInstanceList extends React.Component<IReportInstanceListProps> {
    public render(): JSX.Element {
        return (
            <div className="report-instances">
                <p>Failed elements:</p>
                <table className="report-instance-table">
                    <tbody>
                        {this.renderInstances()}
                    </tbody>
                </table>
            </div>
        );
    }

    private renderInstances(): JSX.Element[] {
        const rows: JSX.Element[] = [];
        this.props.nodeResults.forEach((nodeResult, index) => {
            rows.push(
                <tr className="path-row" key={`path-row-${index}`}>
                    <td className="label">Path</td>
                    <td className="content">{nodeResult.target}</td>
                </tr>,
            );
            rows.push(
                <tr className="snippet-row" key={`snippet-row-${index}`}>
                    <td className="label">Snippet</td>
                    <td className="content">{nodeResult.html}</td>
                </tr>,
            );
        });
        return rows;
    }
}
