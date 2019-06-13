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
    <li>
        <span className="icon" aria-hidden="true">
            <CommentIcon />
        </span>
        <span className="screen-reader-only" id="comment-text">
            {screenReaderText}
        </span>
        <span className="text description-text" aria-labelledby="comment-text" aria-hidden="true">
            {description}
        </span>
    </li>
);

export const DetailsSection = NamedSFC<DetailsSectionProps>('DetailsSection', props => {
    const { pageUrl, description, scanDate, toUtcString } = props;
    const scanDateUTC: string = toUtcString(scanDate);
    const screenReaderTexts = {
        scanDate: `Scan date: ${scanDateUTC}`,
        comment: `Comment: ${description}`,
    };
    const showCommentRow = !!description && description !== '';
    return (
        <div className="scan-details-section">
            <h2>Scan details</h2>
            <ul className="details-section-list">
                <li>
                    <span className="icon" aria-hidden="true">
                        <UrlIcon />
                    </span>
                    <span className="screen-reader-only">Target page: </span>
                    <span className="text">
                        <NewTabLink href={pageUrl}>{pageUrl}</NewTabLink>
                    </span>
                </li>
                <li>
                    <span className="icon" aria-hidden="true">
                        <DateIcon />
                    </span>
                    <span className="screen-reader-only" id="scan-date-text">
                        {screenReaderTexts.scanDate}
                    </span>
                    <span className="text" aria-labelledby="scan-date-text" aria-hidden="true">
                        {scanDateUTC}
                    </span>
                </li>
                {showCommentRow ? createCommentRow(description, screenReaderTexts.comment) : null}
            </ul>
        </div>
    );
});
