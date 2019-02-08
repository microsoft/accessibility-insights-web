// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { css } from '@uifabric/utilities';

export interface IHeaderProps {
    title: string;
    subtitle?: React.ReactChild;
    rowExtraClassName?: string;
    extraContent?: JSX.Element;
}

const Header = (props: IHeaderProps) => {
    return (
        <header className="ms-Grid launch-panel-header">
            <div className={css('ms-Grid-row', props.rowExtraClassName)}>
                <div role="heading" aria-level={1} className="ms-Grid-col ms-u-sm10 ms-fontColor-neutralPrimary ms-font-xl old">
                    {props.title}
                </div>
                {props.extraContent}
            </div>
            <div className="ms-fontColor-neutralSecondary ms-fontWeight-semilight ms-fontSize-xs">{props.subtitle}</div>
        </header>
    );
};

export default Header;
