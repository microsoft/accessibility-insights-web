// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SimpleCardRow } from 'common/components/cards/simple-card-row';
import { CardRowProps } from 'common/configs/unified-result-property-configurations';
import { NamedFC } from 'common/react/named-fc';
import { isEmpty } from 'lodash';
import * as React from 'react';
import styles from './related-paths-card-row.scss';

export interface RelatedPathsCardRowProps extends CardRowProps {
    propertyData: string[];
}

export const RelatedPathsCardRow = NamedFC<RelatedPathsCardRowProps>(
    'RichResolutionCardRow',
    ({ index, propertyData }) => {
        if (isEmpty(propertyData)) {
            return null;
        }

        return (
            <SimpleCardRow
                label={`Related paths`}
                content={
                    <ul className={styles.pathList}>
                        {propertyData.map(selector => (
                            <li key={selector}>{selector}</li>
                        ))}
                    </ul>
                }
                rowKey={`related-paths-row-${index}`}
            />
        );
    },
);
