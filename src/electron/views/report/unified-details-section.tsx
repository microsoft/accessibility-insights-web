// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { CommentIcon } from 'common/icons/comment-icon';
import { DateIcon } from 'common/icons/date-icon';
import { UrlIcon } from 'common/icons/url-icon';
import { NamedFC } from 'common/react/named-fc';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { DetailsSectionProps } from 'reports/components/report-sections/details-section';

export const UnifiedDetailsSection = NamedFC<DetailsSectionProps>('DetailsSection', props => {
    const { targetAppInfo, description, scanDate, toUtcString } = props;

    const createListItem = (
        icon: JSX.Element,
        label: string,
        content: string | JSX.Element,
        contentClassName?: string,
    ) => (
        <li>
            <span className="icon" aria-hidden="true">
                {icon}
            </span>
            <span className="screen-reader-only">{label}</span>
            <span className={css('text', contentClassName)}>{content}</span>
        </li>
    );

    const scanDateUTC: string = toUtcString(scanDate);
    const showCommentRow = !isEmpty(description);
    const connectedDevice = `${targetAppInfo.device} - ${targetAppInfo.name}`;

    return (
        <div className="scan-details-section">
            <h2>Scan details</h2>
            <ul className="details-section-list">
                {createListItem(<UrlIcon />, 'connected device name:', connectedDevice)}
                {createListItem(<DateIcon />, 'scan date:', scanDateUTC)}
                {showCommentRow &&
                    createListItem(<CommentIcon />, 'comment:', description, 'description-text')}
            </ul>
        </div>
    );
});
