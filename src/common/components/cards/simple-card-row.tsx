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

        return (
            <tr className={styles.row} key={rowKey}>
                <th className={styles.rowLabel}>{givenLabel}</th>
                <td className={contentStyling}>{content}</td>
            </tr>
        );
    },
);
