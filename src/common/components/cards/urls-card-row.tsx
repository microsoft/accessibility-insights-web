// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardRowProps } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { SimpleCardRow } from './simple-card-row';
import * as styles from './urls-card-row.scss';

export interface UrlsPropertyData {
    urls: string[];
}

export interface UrlsCardRowProps extends CardRowProps {
    propertyData: UrlsPropertyData;
}

export const UrlsCardRow = NamedFC<UrlsCardRowProps>('UrlsCardRow', ({ deps, ...props }) => {
    const renderUrlContent = () => {
        return (
            <ul className={styles.urlsRowContent}>
                {props.propertyData.urls.map((url, index) => (
                    <li key={`urls-${index}`}>
                        <deps.LinkComponent href={url}>{url}</deps.LinkComponent>
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
