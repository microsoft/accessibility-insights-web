// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';

export interface SimpleCardRowProps {
    label: string;
    content: string | JSX.Element;
    rowKey: string;
    needsExtraClassname?: boolean;
}

export const SimpleCardRow = NamedSFC<SimpleCardRowProps>('SimpleCardRow', ({ label, content, rowKey, needsExtraClassname }) => {
    const contentStyling = classNames({
        'instance-list-row-content': true,
        'content-snipppet': !!needsExtraClassname,
    });

    return (
        <tr className="row" key={rowKey}>
            <th className="label">{label}</th>
            <td className={contentStyling}>{content}</td>
        </tr>
    );
});
