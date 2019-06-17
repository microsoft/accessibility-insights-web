// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';
import { NewTabLink } from '../../../../common/components/new-tab-link';
import { CommentIcon } from '../../../../common/icons/comment-icon';
import { DateIcon } from '../../../../common/icons/date-icon';
import { UrlIcon } from '../../../../common/icons/url-icon';
import { NamedSFC } from '../../../../common/react/named-sfc';
import { detailsSectionList, icon as iconClass, scanDetailsSection, screenReaderOnly } from './details-section.scss';
import { SectionProps } from './report-section-factory';

export type DetailsSectionProps = Pick<SectionProps, 'pageUrl' | 'description' | 'scanDate' | 'toUtcString'>;

export const DetailsSection = NamedSFC<DetailsSectionProps>('DetailsSection', props => {
    const { pageUrl, description, scanDate, toUtcString } = props;

    const createListItem = (icon: JSX.Element, label: string, content: string | JSX.Element, contentClassName?: string) => (
        <li>
            <span className={iconClass} aria-hidden="true">
                {icon}
            </span>
            <span className={screenReaderOnly}>{label}</span>
            <span className={css('text', contentClassName)}>{content}</span>
        </li>
    );

    const scanDateUTC: string = toUtcString(scanDate);
    const showCommentRow = !!description && description !== '';

    return (
        <div className={scanDetailsSection}>
            <h2>Scan details</h2>
            <ul className={detailsSectionList}>
                {createListItem(<UrlIcon />, 'target page:', <NewTabLink href={pageUrl}>{pageUrl}</NewTabLink>)}
                {createListItem(<DateIcon />, 'scan date:', scanDateUTC)}
                {showCommentRow && createListItem(<CommentIcon />, 'comment:', description, 'description-text')}
            </ul>
        </div>
    );
});
