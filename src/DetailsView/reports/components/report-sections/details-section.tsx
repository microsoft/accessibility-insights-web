// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { CommentIcon } from '../../../../common/icons/comment-icon';
import { DateIcon } from '../../../../common/icons/date-icon';
import { UrlIcon } from '../../../../common/icons/url-icon';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { SectionProps } from './report-section-factory';

export type DetailsSectionProps = Pick<SectionProps, 'pageUrl' | 'description' | 'scanDate' | 'toUtcString'>;

const createCommentRow = (description: string, screenReaderText: string) => (
    <tr>
        <td className="icon" aria-hidden="true">
            <CommentIcon />
        </td>
        <td className="screen-reader-only" id="comment-text">
            {screenReaderText}
        </td>
        <td className="text description-text" aria-labelledby="comment-text" aria-hidden="true">
            {description}
        </td>
    </tr>
);

export const DetailsSection = NamedSFC<DetailsSectionProps>('DetailsSection', props => {
    const { pageUrl, description, scanDate, toUtcString } = props;
    const scanDateUTC: string = toUtcString(scanDate);
    const screenReaderTexts = {
        targetPageLink: `Target Page: ${pageUrl}`,
        scanDate: `Scan date: ${scanDateUTC}`,
        comment: `Comment: ${description}`,
    };
    const showCommentRow = description !== '';
    return (
        <div className="scan-details-section">
            <h2>Scan details</h2>
            <table>
                <tbody>
                    <tr>
                        <td className="icon" aria-hidden="true">
                            <UrlIcon />
                        </td>
                        <td className="screen-reader-only" id="target-page-text">
                            {screenReaderTexts.targetPageLink}
                        </td>
                        <td className="text" aria-labelledby="target-page-text" aria-hidden="true">
                            <NewTabLink href={pageUrl} title="Navigate to target page">
                                {pageUrl}
                            </NewTabLink>
                        </td>
                    </tr>
                    <tr>
                        <td className="icon" aria-hidden="true">
                            <DateIcon />
                        </td>
                        <td className="screen-reader-only" id="scan-date-text">
                            {screenReaderTexts.scanDate}
                        </td>
                        <td className="text" aria-labelledby="scan-date-text" aria-hidden="true">
                            {scanDateUTC}
                        </td>
                    </tr>
                    {showCommentRow ? createCommentRow(description, screenReaderTexts.comment) : null}
                </tbody>
            </table>
        </div>
    );
});
