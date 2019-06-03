// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../../../common/components/new-tab-link';
import { CommentIcon } from '../../../../common/icons/comment-icon';
import { DateIcon } from '../../../../common/icons/date-icon';
import { UrlIcon } from '../../../../common/icons/url-icon';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { FormattedDate } from '../formatted-date';
import { SectionProps } from './report-section-factory';

export type DetailsSectionProps = Pick<SectionProps, 'pageUrl' | 'description' | 'scanDate'>;

export const DetailsSection = NamedSFC<DetailsSectionProps>('DetailsSection', props => {
    const { pageUrl, description, scanDate } = props;

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
                            <NewTabLink href={pageUrl} title="Navigate to target page">
                                {pageUrl}
                            </NewTabLink>
                        </td>
                    </tr>
                    <tr>
                        <td className="icon" aria-hidden="true">
                            <DateIcon />
                        </td>
                        <td>
                            <FormattedDate date={scanDate} />
                        </td>
                    </tr>
                    <tr>
                        <td className="icon" aria-hidden="true">
                            <CommentIcon />
                        </td>
                        <td>{description}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});
