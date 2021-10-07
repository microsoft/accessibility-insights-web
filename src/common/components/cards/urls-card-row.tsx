// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardRowProps } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { UrlInfo } from 'reports/package/accessibilityInsightsReport';
import { SimpleCardRow } from './simple-card-row';
import * as styles from './urls-card-row.scss';

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
                {urlInfos.map((urlInfo, index) => (
                    <li key={`urls-${index}`}>
                        <deps.LinkComponent href={urlInfo.url}>{urlInfo.url}</deps.LinkComponent>
                        {getBaselineHighlight(urlInfo)}
                    </li>
                ))}
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

function getBaselineHighlight(urlInfo: UrlInfo): JSX.Element | null {
    if (urlInfo.baselineStatus === 'new') {
        return (
            <span key="status" className={styles.urlsRowContentNewFailure}>
                {'  NEW!'}
            </span>
        );
    }
    return null;
}
