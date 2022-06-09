// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardRowDeps, CardRowProps } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { UrlInfo } from 'reports/package/accessibilityInsightsReport';
import { SimpleCardRow } from './simple-card-row';
import styles from './urls-card-row.scss';

export interface UrlsPropertyData {
    urlInfos: UrlInfo[];
}

export interface UrlsCardRowProps extends CardRowProps {
    propertyData: UrlsPropertyData;
}

export const UrlsCardRow = NamedFC<UrlsCardRowProps>('UrlsCardRow', ({ deps, ...props }) => {
    const urlInfos = props.propertyData.urlInfos;

    const renderUrlContent = () => {
        return (
            <ul className={styles.urlsRowContent}>
                {urlInfos.map((urlInfo, index) => getUrlListItem(urlInfo, index, deps))}
            </ul>
        );
    };

    return (
        <SimpleCardRow
            label="URL"
            content={renderUrlContent()}
            rowKey={`urls-row-${props.index}`}
        />
    );
});

const isNewViolation = (urlInfo: UrlInfo): boolean => {
    return urlInfo.baselineStatus === 'new';
};

function getUrlListItem(urlInfo: UrlInfo, index: number, deps: CardRowDeps): JSX.Element {
    const key = `urls-${index}`;

    if (isNewViolation(urlInfo)) {
        return (
            <li key={key}>
                <deps.LinkComponent aria-label={`NEW. ${urlInfo.url}`} href={urlInfo.url}>
                    {urlInfo.url}
                </deps.LinkComponent>
                <span key="new" aria-hidden="true" className={styles.urlsRowContentNewFailure}>
                    {'  NEW!'}
                </span>
            </li>
        );
    }

    return (
        <li key={key}>
            <deps.LinkComponent href={urlInfo.url}>{urlInfo.url}</deps.LinkComponent>
        </li>
    );
}
