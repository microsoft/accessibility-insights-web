// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { title } from '../../../content/strings/application';
import { FormattedDate } from './formatted-date';

// tslint:disable-next-line:interface-name
export interface IReportScanDetailsProps {
    pageTitle: string;
    pageUrl: string;
    description: string;
    scanDate: Date;
    browserSpec: string;
    extensionVersion: string;
    axeVersion: string;
}

export class ReportScanDetails extends React.Component<IReportScanDetailsProps> {
    public render() {
        return (
            <div className="report-scan-details">
                <table>
                    <tbody>
                        <tr>
                            <td className="label">Target page</td>
                            <td>
                                <span id="page-title">{this.props.pageTitle}</span>
                                {' ('}
                                <NewTabLink href={this.props.pageUrl} aria-labelledby="page-title" title="Navigate to target page">
                                    {this.props.pageUrl}
                                </NewTabLink>
                                )
                            </td>
                        </tr>
                        <tr>
                            <td className="label">Description</td>
                            <td>{this.props.description}</td>
                        </tr>
                        <tr>
                            <td className="label">Scan date/time</td>
                            <td>
                                <FormattedDate date={this.props.scanDate} />
                            </td>
                        </tr>
                        <tr>
                            <td className="label">Environment</td>
                            <td>{this.props.browserSpec}</td>
                        </tr>
                        <tr>
                            <td className="label">Tool version</td>
                            <td>
                                {title} {this.props.extensionVersion}; Axe {this.props.axeVersion}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
