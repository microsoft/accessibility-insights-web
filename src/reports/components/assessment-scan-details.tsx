// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CommentIcon } from 'common/icons/comment-icon';
import { DateIcon } from 'common/icons/date-icon';
import { UrlIcon } from 'common/icons/url-icon';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { ScanDetailsReportModel } from '../assessment-report-model';
import { FormattedDate, FormattedDateDeps } from './formatted-date';

export type AssessmentScanDetailsDeps = FormattedDateDeps;

export interface AssessmentScanDetailsProps {
    deps: AssessmentScanDetailsDeps;
    details: ScanDetailsReportModel;
    description: string;
}

export class AssessmentScanDetails extends React.Component<AssessmentScanDetailsProps> {
    public render(): JSX.Element {
        return (
            <div className="assessment-scan-details">
                <h3>Scan details</h3>
                <table>
                    <tbody>
                        <tr>
                            <td className="icon">
                                <UrlIcon />
                            </td>
                            <td>
                                <NewTabLinkWithConfirmationDialog
                                    href={this.props.details.url}
                                    title="Navigate to target page"
                                >
                                    {this.props.details.url}
                                </NewTabLinkWithConfirmationDialog>
                            </td>
                        </tr>
                        <tr>
                            <td className="icon">
                                <DateIcon />
                            </td>
                            <td>
                                <FormattedDate
                                    deps={this.props.deps}
                                    date={this.props.details.reportDate}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="icon">
                                <CommentIcon />
                            </td>
                            <td className="assessment-scan-details-description">
                                {this.props.description}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
