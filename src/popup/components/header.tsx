// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as React from 'react';
import { NamedFC } from '../../common/react/named-fc';

export interface HeaderProps {
    title: string;
    subtitle?: React.ReactChild;
    rowExtraClassName?: string;
    children?: JSX.Element;
}

export const Header = NamedFC<HeaderProps>('Header', props => {
    return (
        <header className="ms-Grid launch-panel-header">
            <div className={css('ms-Grid-row', props.rowExtraClassName)}>
                <div role="heading" aria-level={1} className="ms-Grid-col ms-u-sm10 ms-fontColor-neutralPrimary ms-font-xl old">
                    {props.title}
                </div>
                {props.children}
            </div>
            <div className="header-subtitle ms-fontWeight-semilight ms-fontSize-xs">{props.subtitle}</div>
        </header>
    );
});
