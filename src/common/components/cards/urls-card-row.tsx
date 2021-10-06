// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardRowProps } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { BaselineAwareUrl } from 'reports/package/accessibilityInsightsReport';
import { SimpleCardRow } from './simple-card-row';
import * as styles from './urls-card-row.scss';

export interface UrlsPropertyData {
    urls?: string[];
    baselineAwareUrls?: BaselineAwareUrl[];
}

export interface UrlsCardRowProps extends CardRowProps {
    propertyData: UrlsPropertyData;
}

export const UrlsCardRow = NamedFC<UrlsCardRowProps>('UrlsCardRow', ({ deps, ...props }) => {
    const baselineAwareUrls = getBaseAwareUrls(props.propertyData);

    const renderUrlContent = () => {
        return (
            <ul className={styles.urlsRowContent}>
                {baselineAwareUrls.map((baselineAwareUrl, index) => (
                    <li key={`urls-${index}`}>
                        <deps.LinkComponent href={baselineAwareUrl.url}>
                            {baselineAwareUrl.url}
                        </deps.LinkComponent>
                        {getBaselineHighlight(baselineAwareUrl)}
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

function getBaseAwareUrls(propertyData: UrlsPropertyData): BaselineAwareUrl[] {
    // TODO DHT: Error handling?

    const baselineAwareUrls: BaselineAwareUrl[] = propertyData.baselineAwareUrls;
    const urls: string[] = propertyData.urls;

    if (baselineAwareUrls) {
        return baselineAwareUrls;
    }

    const convertedArray: BaselineAwareUrl[] = [];
    urls.forEach(url => {
        convertedArray.push({ url, status: 'unknown' });
    });

    return convertedArray;
}

function getBaselineHighlight(baselineAwareUrl: BaselineAwareUrl): JSX.Element {
    if (baselineAwareUrl.status === 'new') {
        return (
            <span key="status" className={styles.urlsRowContentNewFailure}>
                {'  NEW!'}
            </span>
        );
    }
    return null;
}
