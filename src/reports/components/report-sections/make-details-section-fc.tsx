// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { CommentIcon } from 'common/icons/comment-icon';
import { DateIcon } from 'common/icons/date-icon';
import { UrlIcon } from 'common/icons/url-icon';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';
import { SectionProps } from './report-section-factory';

export type DetailsSectionProps = Pick<
    SectionProps,
    'targetAppInfo' | 'deviceName' | 'description' | 'scanDate' | 'toUtcString'
>;

export type ScanDetailInfo = {
    label: string;
    content: string | JSX.Element;
};

export function makeDetailsSectionFC(
    getUrlOrDeviceItemInfo: (appInfo: TargetAppData, device: string) => ScanDetailInfo,
): ReactFCWithDisplayName<DetailsSectionProps> {
    return NamedFC<DetailsSectionProps>('DetailsSection', props => {
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

        const scanDateUTC: string = toUtcString(scanDate);
        const showCommentRow = !!description && description !== '';
        const urlOrDeviceItemInfo: ScanDetailInfo = getUrlOrDeviceItemInfo(
            targetAppInfo,
            deviceName,
        );

        return (
            <div className="scan-details-section">
                <h2>Scan details</h2>
                <ul className="details-section-list">
                    {createListItem(
                        <UrlIcon />,
                        urlOrDeviceItemInfo.label,
                        urlOrDeviceItemInfo.content,
                    )}
                    {createListItem(<DateIcon />, 'scan date:', scanDateUTC)}
                    {showCommentRow &&
                        createListItem(
                            <CommentIcon />,
                            'comment:',
                            description,
                            'description-text',
                        )}
                </ul>
            </div>
        );
    });
}
