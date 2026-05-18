// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@fluentui/utilities';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import styles from '../../../reports/components/instance-details.scss';

export interface SimpleCardRowProps {
    label: string;
    content: string | JSX.Element;
    rowKey: string;
    contentClassName?: string;
}

export const SimpleCardRow = NamedFC<SimpleCardRowProps>(
    'SimpleCardRow',
    ({ label: givenLabel, content, rowKey, contentClassName }) => {
        const contentStyling = css(styles.rowContent, contentClassName);
        const rawId = React.useId().replace(/:/g, '');
        const headerId = `card-row-label-${rawId}`;
        const contentId = `card-row-content-${rawId}`;

        return (
            <tr className={styles.row} key={rowKey}>
                <th scope="row" id={headerId} className={styles.rowLabel}>
                    {givenLabel}
                </th>
                <td
                    id={contentId}
                    headers={headerId}
                    aria-labelledby={`${headerId} ${contentId}`}
                    className={contentStyling}
                >
                    {content}
                </td>
            </tr>
        );
    },
);
