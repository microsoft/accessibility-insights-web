// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { CommentIcon } from '../../../common/icons/comment-icon';
import { DateIcon } from '../../../common/icons/date-icon';
import { UrlIcon } from '../../../common/icons/url-icon';
import { IScanDetailsReportModel } from '../assessment-report-model';
import { FormattedDate } from './formatted-date';

// tslint:disable-next-line:interface-name
export interface IAssessmentScanDetailsProps {
    details: IScanDetailsReportModel;
    description: string;
}

export class AssessmentScanDetails extends React.Component<IAssessmentScanDetailsProps> {
    public render(): JSX.Element {
        return (
            <div className="assessment-scan-details">
                <h3>Scan details</h3>
                <table>
                    <tbody>
                        <tr>
                            <td className="icon" aria-hidden="true">
                                <UrlIcon />
                            </td>
                            <td>
                                <NewTabLink href={this.props.details.url} title="Navigate to target page">
                                    {this.props.details.url}
                                </NewTabLink>
                            </td>
                        </tr>
                        <tr>
                            <td className="icon" aria-hidden="true">
                                <DateIcon />
                            </td>
                            <td>
                                <FormattedDate date={this.props.details.reportDate} />
                            </td>
                        </tr>
                        <tr>
                            <td className="icon" aria-hidden="true">
                                <CommentIcon />
                            </td>
                            <td>{this.props.description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
