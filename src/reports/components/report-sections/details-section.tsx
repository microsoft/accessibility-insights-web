// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { CommentIcon } from 'common/icons/comment-icon';
import { DateIcon } from 'common/icons/date-icon';
import { UrlIcon } from 'common/icons/url-icon';
import { NamedFC } from 'common/react/named-fc';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { NewTabLinkWithConfirmationDialog } from 'reports/components/new-tab-link-confirmation-dialog';
import { SectionProps } from './report-section-factory';

export type DetailsSectionProps = Pick<
    SectionProps,
    'targetAppInfo' | 'deviceName' | 'description' | 'scanDate' | 'toUtcString'
>;

export const DetailsSection = NamedFC<DetailsSectionProps>('DetailsSection', props => {
    const { targetAppInfo, deviceName, description, scanDate, toUtcString } = props;

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

    const createUrlOrDeviceItem = (appInfo: TargetAppData, device: string) => {
        let label: string;
        let content: string | JSX.Element;

        if (deviceName !== undefined) {
            content = `${device} - ${targetAppInfo.name}`;
            label = 'connected device name:';
        } else {
            label = 'target page url:';
            content = (
                <NewTabLinkWithConfirmationDialog href={appInfo.url} title={appInfo.name}>
                    {appInfo.url}
                </NewTabLinkWithConfirmationDialog>
            );
        }
        return createListItem(<UrlIcon />, label, content);
    };

    const scanDateUTC: string = toUtcString(scanDate);
    const showCommentRow = !!description && description !== '';

    return (
        <div className="scan-details-section">
            <h2>Scan details</h2>
            <ul className="details-section-list">
                {createUrlOrDeviceItem(targetAppInfo, deviceName)}
                {createListItem(<DateIcon />, 'scan date:', scanDateUTC)}
                {showCommentRow &&
                    createListItem(<CommentIcon />, 'comment:', description, 'description-text')}
            </ul>
        </div>
    );
});
